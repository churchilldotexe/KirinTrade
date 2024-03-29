import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import type { Product } from "@prisma/client";
import Link from "next/link";

const getMostPopularOrder = async (): Promise<Product[]> => {
  return await db.product.findMany({
    where: { isAvailableforPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
};
const getNewestOrder = async (): Promise<Product[]> => {
  return await db.product.findMany({
    where: { isAvailableforPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
};

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        productFetcher={getMostPopularOrder}
        title="Most Popular"
      />
      <ProductGridSection productFetcher={getNewestOrder} title="Newest" />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

async function ProductGridSection({
  productFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button variant={"outline"} asChild>
          <Link href={"/products"}>View All &rarr;</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(await productFetcher()).map((product, index) => (
          <ProductCard key={product.id} {...product} index={index} />
        ))}
      </div>
    </div>
  );
}
