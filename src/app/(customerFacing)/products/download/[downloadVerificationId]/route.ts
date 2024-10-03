import { serverClient } from "@/trpc/serverClient";
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

  const fileResp = await fetch(verificationData.filePath);
  const contentType =
    fileResp.headers.get("Content-Type") || "application/octet-stream";
  return new NextResponse(fileResp.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${verificationData.name}.${verificationData.fileExtension}"`,
      "Content-length": verificationData.fileSize!.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
