import db from "@/db/db";
import { serverClient } from "@/trpc/serverClient";
import fs from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } },
) {
  const verificationData = await serverClient.downloads.getMyVerification({
    id: downloadVerificationId,
  });

  // if download info is expired
  if (!verificationData) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url),
    );
  }

  const { size } = await fs.stat(verificationData.filePath);
  const file = await fs.readFile(verificationData.filePath);
  const extension = verificationData.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${verificationData.name}.${extension}"`,
      "Content-length": size.toString(),
    },
  });
}
