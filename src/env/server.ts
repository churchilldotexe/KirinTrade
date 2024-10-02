import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string().min(1),
    TURSO_AUTH_TOKEN: z.string().min(1),
    ADMIN_USER: z.string().min(1),
    HASHED_ADMIN_PASSWORD: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_PUBLIC_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SENDER_EMAIL: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  // eslint-disable-next-line no-undef
  experimental__runtimeEnv: process.env,
});
