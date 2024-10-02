import { z } from "zod";

const uploadResponseSchema = z.object({
  status: z.enum(["done", "still working"]),
  fileData: z.object({
    appId: z.string(),
    fileKey: z.string(),
    fileUrl: z.string().url(),
    fileType: z.string(),
    callbackSlug: z.string(),
    callbackUrl: z.string(),
    metadata: z.string(),
    fileName: z.string(),
    fileSize: z.number().int().positive(),
    customId: z.string().nullable(),
    acl: z.string(),
    apiKey: z.string(),
  }),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;

export { uploadResponseSchema };
