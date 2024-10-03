"use server";

import { serverClient } from "@/trpc/serverClient";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function deleteUser(id: string) {
  const user = serverClient.admin.users.deleteUser({ id });

  if (user === null) return notFound();
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/stripe/purchase-success");
}
