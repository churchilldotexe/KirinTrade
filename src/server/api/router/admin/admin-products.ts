import products from "@/server/database/schema/products";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { asc, eq, sql } from "drizzle-orm";
import { orders } from "@/server/database/schema";
import { z } from "zod";
import { randomUUID } from "crypto";
import { UTApi, UploadThingError } from "uploadthing/server";
const fileSchema = z
  .instanceof(File, { message: "Must be a file" })
  .refine((file) => file.size > 0, { message: "file is required" });
const imageSchema = fileSchema.refine(
  (image) => image.type.startsWith("image/"),
  { message: "image is required" },
);

const utapi = new UTApi();

export const adminProductsRouter = createTRPCRouter({
  getAllProductsData: publicProcedure.query(async ({ ctx }) => {
    const productsData = await ctx.db
      .select({
        name: products.name,
        id: products.id,
        isAvailableforPurchase: products.isAvailableforPurchase,
        priceInCents: products.priceInCents,
        ordersCount: sql<number>`count(distinct ${orders.id})`,
      })
      .from(products)
      .leftJoin(orders, eq(orders.productId, products.id))
      .groupBy(
        products.name,
        products.id,
        products.isAvailableforPurchase,
        products.priceInCents,
      )
      .orderBy(asc(products.name));
    return productsData;
  }),

  createProduct: publicProcedure
    .input(
      z.object({
        isAvailableforPurchase: z.boolean(),
        name: z.string().min(1),
        priceInCents: z.number(),
        description: z.string(),
        file: fileSchema,
        image: imageSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();
      const {
        isAvailableforPurchase,
        file,
        image,
        description,
        priceInCents,
        name,
      } = input;
      const [fileRes, imageRes] = await utapi.uploadFiles([file, image]);
      if (!fileRes || !imageRes) {
        throw new UploadThingError({
          code: "BAD_REQUEST",
          message: "Unable to upload your data",
        });
      }
      if (fileRes.error) {
        throw new UploadThingError({
          code: fileRes.error.code,
          message: fileRes.error.message,
        });
      }

      if (imageRes.error) {
        throw new UploadThingError({
          code: imageRes.error.code,
          message: imageRes.error.message,
        });
      }

      const fileExtension = fileRes?.data.name.split(".").pop();

      await ctx.db.insert(products).values({
        isAvailableforPurchase,
        name,
        priceInCents,
        fileKey: fileRes.data.key,
        fileExtension,
        fileSize: fileRes.data.size,
        filePath: fileRes.data.url,
        imagePath: imageRes.data.url,
        imageKey: imageRes.data.key,
        description,
        id: uuid,
      });
    }),

  updateProduct: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        priceInCents: z.number(),
        description: z.string().min(1),
        file: fileSchema.optional(),
        image: imageSchema.optional(),
        fileKeyRef: z.string().nullable(),
        imageKeyRef: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        image,
        file,
        imageKeyRef,
        fileKeyRef,
        id,
        description,
        priceInCents,
        name,
      } = input;
      let newFileUrl: string = "";
      let newFileKey: string = "";
      let newFileSize: number = 0;
      let newImageUrl: string = "";
      let newImageKey: string = "";
      let newFileExtension: string = "";

      if (file !== undefined && file.size > 0) {
        const uploadedFileRes = await utapi.uploadFiles(file);
        if (!uploadedFileRes.data) {
          throw new UploadThingError({
            code: uploadedFileRes.error.code,
            message: uploadedFileRes.error.message,
          });
        }
        newFileUrl = uploadedFileRes.data.url;
        newFileKey = uploadedFileRes.data.key;
        newFileSize = uploadedFileRes.data.size;
        newFileExtension = uploadedFileRes.data.name.split(".").pop() as string; // the fileName always ends with .ext
      }

      if (image !== undefined && image.size > 0) {
        const uploadedImageRes = await utapi.uploadFiles(image);
        if (!uploadedImageRes.data) {
          throw new UploadThingError({
            code: uploadedImageRes.error.code,
            message: uploadedImageRes.error.message,
          });
        }
        newImageUrl = uploadedImageRes.data.url;
        newImageKey = uploadedImageRes.data.key;
      }

      await ctx.db
        .update(products)
        .set({
          name,
          imagePath: newImageUrl,
          imageKey: newImageKey,
          fileExtension: newFileExtension,
          fileKey: newFileKey,
          fileSize: newFileSize,
          filePath: newFileUrl,
          description,
          priceInCents,
          updatedAt: sql`(strftime('%s', 'now'))`,
        })
        .where(eq(products.id, id));

      // delete old image and file for book keeping
      if (file !== undefined && file.size > 0 && fileKeyRef) {
        const isDeleted = await utapi.deleteFiles(fileKeyRef);
        if (isDeleted.success === false) {
          throw new UploadThingError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete your files",
          });
        }
      }
      if (image !== undefined && image.size > 0 && imageKeyRef) {
        const isDeleted = await utapi.deleteFiles(imageKeyRef);

        if (isDeleted.success === false) {
          throw new UploadThingError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete your files",
          });
        }
      }
    }),

  updateProductAvailability: publicProcedure
    .input(
      z.object({ isAvailableforPurchase: z.boolean(), id: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({
          isAvailableforPurchase: input.isAvailableforPurchase,
          updatedAt: sql`(strftime('%s','now'))`,
        })
        .where(eq(products.id, input.id));
    }),

  deleteProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning()
        .get();

      if (deletedProduct?.imageKey && deletedProduct.fileKey) {
        const isDeleted = await utapi.deleteFiles([
          deletedProduct.fileKey,
          deletedProduct.imageKey,
        ]);
        if (isDeleted.success === false) {
          throw new UploadThingError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete your files",
          });
        }
      }

      return deletedProduct;
    }),
});
