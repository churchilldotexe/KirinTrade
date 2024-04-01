import CheckoutForm from "@/components/CheckoutForm";
import db from "@/db/db";
import { env } from "@/env";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });

  if (product === null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    payment_method_types: ["card"],
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret === null) {
    throw Error("Failed creating payment intent");
  }

  const clientSecret = paymentIntent.client_secret;
  return <CheckoutForm clientSecret={clientSecret} product={product} />;
}
