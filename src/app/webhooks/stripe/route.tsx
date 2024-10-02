import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";
import { env } from "@/env/server";
import { serverClient } from "@/trpc/serverClient";

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

    if (!productId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const product = await serverClient.products.getMyProduct(productId);

    if (!product || email === null || productId === undefined) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { userId } = await serverClient.users.createUser({ email });
    const [order] = await serverClient.orders.createOrder({
      pricePaidInCents,
      userId,
      productId,
    });
    const downloadVerification =
      await serverClient.downloads.createDownloadVerfication({ productId });

    await resend.emails.send({
      from: `Support <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: (
        <PurchaseReceiptEmail
          product={product}
          order={order!}
          downloadVerificationId={downloadVerification}
        />
      ),
    });
  }
  return new NextResponse();
}
