"use server";

import { serverClient } from "@/trpc/serverClient";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function deleteOrder(id: string) {
  const order = await serverClient.admin.orders.deleteOrder({ id });

  if (order === null) return notFound();
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/stripe/purchase-success");
}
