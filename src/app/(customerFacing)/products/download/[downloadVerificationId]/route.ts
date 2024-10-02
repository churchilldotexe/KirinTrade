import { env } from "@/env/server";
import { uploadResponseSchema } from "@/lib/schema";
import { fetcher } from "@/lib/utils";
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

  // FIX: connect the actual fileKey
  const url = `https://api.uploadthing.com/v6/pollUpload/${"f5hLW8iUdIw6qGlCDFxL8NeVA0SP9OQTwdloK3zaCkRIj4Ls"}`;
  const reqst = new Request(url, {
    headers: {
      "X-Uploadthing-Api-Key": env.UPLOADTHING_TOKEN,
    },
  });

  const data = await fetcher(
    url,
    { headers: reqst.headers },
    uploadResponseSchema,
  );
  if (data.success === false) {
    console.error(data.error, "error");
    return new NextResponse(
      JSON.stringify({ message: "Unable to get the download file" }),
      { status: 401 },
    );
  }

  const size = data.data.fileData.fileSize;
  const extension = data.data.fileData.fileName.split(".").pop();

  const fileResp = await fetch(data.data.fileData.fileUrl);

  return new NextResponse(fileResp.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${verificationData.name}.${extension}"`,
      "Content-length": size.toString(),
    },
  });
}
