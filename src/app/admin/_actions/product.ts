"use server";

import { serverClient } from "@/trpc/serverClient";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "a file required" });
const imageScheme = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageScheme.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await serverClient.admin.products.createProduct({
    isAvailableforPurchase: false,
    name: data.name,
    priceInCents: data.priceInCents,
    description: data.description,
    file: data.file,
    image: data.image,
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

const editScheme = addSchema.extend({
  file: fileSchema.optional(),
  image: fileSchema.optional(),
});

export async function updateProduct(
  productId: string,
  prevState: unknown,
  formData: FormData,
) {
  const result = editScheme.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  const product = await serverClient.products.getMyProduct(productId);
  if (!product) return notFound();

  await serverClient.admin.products.updateProduct({
    id: productId,
    name: data.name,
    priceInCents: data.priceInCents,
    description: data.description,
    file: data.file,
    image: data.image,
    fileKeyRef: product.fileKey,
    imageKeyRef: product?.imageKey,
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableforPurchase: boolean,
) {
  await serverClient.admin.products.updateProductAvailability({
    id,
    isAvailableforPurchase,
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const product = await serverClient.admin.products.deleteProduct({ id });

  if (!product) return notFound();

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
}
