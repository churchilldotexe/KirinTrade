"use server";
import { z } from "zod";
import { Resend } from "resend";
import OrderHistoryEmail from "@/email/OrderHistory";
import { env } from "@/env/server";
import { serverClient } from "@/trpc/serverClient";

const emailSchema = z.string().email();
const resend = new Resend(env.RESEND_API_KEY);

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData,
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return {
      error: "Invalid Email Address",
    };
  }

  const user = await serverClient.users.getUserOrder({ email: result.data });

  // security precaution
  if (!user) {
    return {
      message:
        " Check your email to view your order history and download your products",
    };
  }

  const orders = user.map(async (order) => {
    return {
      ...order,
      downloadVerificationId:
        await serverClient.downloads.createDownloadVerfication({
          productId: order.productId as string,
        }),
    };
  });

  // to ensure the values that is null(possible nulls from leftJoin) and promise failed will be excluded but not the fulfilled promise
  const awaitedOrders = await Promise.allSettled(orders);
  const settledOrders = awaitedOrders
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        downloadVerificationId: string;
        userId: string;
        email: string;
        pricePaidInCents: number | null;
        orderId: string | null;
        createdAt: Date | null;
        productId: string | null;
        productName: string | null;
        imagePath: string | null;
        description: string | null;
      }> => result.status === "fulfilled",
    )
    .map((result) => result.value);

  const data = await resend.emails.send({
    from: `Support <${env.SENDER_EMAIL}>`,
    to: user[0]?.email as string,
    subject: "Order History",
    react: <OrderHistoryEmail orders={settledOrders} />,
  });

  if (data.error) {
    return { error: "There was an error sending your email. Please try again" };
  }

  return {
    message:
      " Check your email to view your order history and download your products",
  };
}
