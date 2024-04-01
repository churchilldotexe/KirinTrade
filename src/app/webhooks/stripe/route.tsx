import db from "@/db/db";
import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const strip = new Stripe(env.STRIPE_WEBHOOK_SECRET);
const resend = new Resend(env.RESEND_API_KEY);
export async function POST(req: NextRequest) {
  const event = strip.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature")!,
    env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;
    const product = db.product.findUnique({ where: { id: productId } });
    if (product === null || email === null || productId === undefined) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: <h1>oh Hi!</h1>,
    });
  }
  return new NextResponse();
}
