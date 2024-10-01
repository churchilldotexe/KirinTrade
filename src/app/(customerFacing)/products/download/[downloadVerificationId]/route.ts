import db from "@/db/db";
import fs from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";

//FIX: change to trpc mutation

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } },
) {
  const verificationData = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  // if download info is expired
  if (verificationData === null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url),
    );
  }

  const { size } = await fs.stat(verificationData.product.filePath);
  const file = await fs.readFile(verificationData.product.filePath);
  const extension = verificationData.product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${verificationData.product.name}.${extension}"`,
      "Content-length": size.toString(),
    },
  });
}
