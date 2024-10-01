"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env/client";
import { formatCurrency } from "@/lib/formatter";
import { trpc } from "@/trpc/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useState, type FormEvent } from "react";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

type CheckoutFormProps = {
  clientSecret: string;
  product: {
    imagePath: string;
    name: string;
    description: string;
    priceInCents: number;
    id: string;
  };
};

export default function CheckoutForm({
  clientSecret,
  product,
}: CheckoutFormProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
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
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  let email = "";
  const { refetch: checkOrderExists } = trpc.orders.getMyOrder.useQuery(
    { email, productId },
    { enabled: false },
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stripe === null || elements === null || !email) return;
    setIsLoading(true);

    const { data: orderExists } = await checkOrderExists();
    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page",
      );
      return;
    }
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      });
      if (
        error &&
        (error.type === "card_error" || error.type === "validation_error")
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occured");
      }
    } catch (error) {
      setErrorMessage("An Error Occured while processing the payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => (email = e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={stripe === null || elements === null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
