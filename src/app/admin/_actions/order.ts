"use server";

import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function deleteOrder(id: string) {
  const user = await db.order.delete({
    where: {
      id,
    },
  });

  if (user === null) return notFound();
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/stripe/purchase-success");
}
