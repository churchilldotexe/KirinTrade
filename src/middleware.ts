import { isValidPassword } from "@/lib/isValidPassword";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if ((await isAuthenticated(request)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic",
      },
    });
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("Authorization") ?? req.headers.get("authorization");

  if (authHeader === null) return false;
  console.log(authHeader);

  const [username, password] = Buffer.from(authHeader.split(" ")[1]!, "base64")
    .toString()
    .split(":");

  if (
    process.env.ADMIN_USER === undefined &&
    process.env.HASED_ADMIN_PASSWORD === undefined
  ) {
    console.error("password and username must be registered");
  }
  return (
    username === process.env.ADMIN_USER &&
    (await isValidPassword(password!, process.env.HASHED_ADMIN_PASSWORD!))
  );
}

export const config = {
  matcher: "/admin/:path*",
};
