import db from "@/db/db";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);
  const product = await db.product.findUnique({ where: { id } });

  if (!!product) return notFound;

  return <div>page</div>;
}
