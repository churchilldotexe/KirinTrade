import { Button } from "@/components/ui/button";
import { env } from "@/env/server";
import { formatCurrency } from "@/lib/formatter";
import { products } from "@/server/database/schema";
import { serverClient } from "@/trpc/serverClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { server } from "typescript";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string; email: string };
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

  if (searchParams.email && isSuccess) {
    const userOrders = await serverClient.users.getUserOrder({
      email: searchParams.email,
    });

    // to make sure order is not being created every refresh if it already exist
    if (
      !userOrders.some(
        (order) => order.productId === paymentIntent.metadata.productId,
      )
    ) {
      let userId = "";
      //means not yet recorded
      if (!userOrders[0]?.userId) {
        const createdUser = await serverClient.users.createUser({
          email: searchParams.email,
        });
        userId = createdUser.userId;
      }

      userId = userOrders[0]?.userId as string; // already made a check
      await serverClient.orders.createOrder({
        pricePadeInCents: product.priceInCents,
        userId,
        productId: paymentIntent.metadata.productId,
      });
    }
  }

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

async function createDownloadVerification(
  productId: string,
): Promise<string | undefined> {
  return await serverClient.downloads.createDownloadVerfication({ productId });
}
