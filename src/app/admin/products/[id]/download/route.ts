import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { serverClient } from "@/trpc/serverClient";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const product = await serverClient.products.getMyProduct(id);

  if (!product) return notFound();

  const file = await fetch(product.filePath);
  const contentType =
    file.headers.get("Content-Type") || "application/octet-stream";

  return new NextResponse(file.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${product.name}.${product.fileExtension}"`,
      "Content-Length": product.fileSize!.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
