"use server";

import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function deleteUser(id: string) {
  const user = await db.user.delete({
    where: {
      id,
    },
  });

  if (user === null) return notFound();
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/stripe/purchase-success");
}
