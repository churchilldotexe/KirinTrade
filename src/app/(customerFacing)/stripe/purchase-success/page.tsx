import { Button } from "@/components/ui/button";
import { env } from "@/env/server";
import { formatCurrency } from "@/lib/formatter";
import { serverClient } from "@/trpc/serverClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent,
  );

  if (!paymentIntent.metadata.productId) return notFound();

  const product = await serverClient.products.getMyProduct(
    paymentIntent.metadata.productId,
  );

  if (!product) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <h1 className="text-4xl font-bold lg:text-center">
        {" "}
        {isSuccess ? (
          "Payment Success!"
        ) : (
          <span className="text-destructive">Payment failed</span>
        )}{" "}
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative aspect-video w-1/3 flex-shrink-0">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,"
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size={"lg"} asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(product.id)}`}
              >
                Download
              </a>
            ) : (
              <Link
                href={`/products/${product.id}/purchase`}
                className="bg-red-600"
              >
                Try Again
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return await serverClient.downloads.createDownloadVerfication({ productId });
}
