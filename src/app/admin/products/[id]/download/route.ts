import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { serverClient } from "@/trpc/serverClient";

// FIX: change to uploadthing later just copy the implementation in the customerfacing
export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  //const product = await db.product.findUnique({where:{id}, select:{filePath:true, name: true}})
  const product = await serverClient.products.getMyProduct(id);

  if (!product) return notFound();

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
