import ProductCard from "@/components/ProductCard";
import SkeletonLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import type { SORT_METHOD } from "@/config";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import type { Product } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

const getMostPopularOrder = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableforPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularOrder"],
  { revalidate: 60 * 60 * 24 },
);

const getNewestOrder = cache(() => {
  return db.product.findMany({
    where: { isAvailableforPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestOrder"]);

export default function functionHomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        productFetcher={getMostPopularOrder}
        title="Most Popular"
        sortBy={"popular"}
      />
      <ProductGridSection
        productFetcher={getNewestOrder}
        title="Newest"
        sortBy={"newest"}
      />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
  sortBy: keyof typeof SORT_METHOD;
};

function ProductGridSection({
  productFetcher,
  title,
  sortBy,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button variant={"outline"} asChild>
          <Link href={`/products?orderBy=${sortBy}`}>View All &rarr;</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<SkeletonLoading />}>
          <RenderSuspendedProducts productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function RenderSuspendedProducts({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product, index) => (
    <ProductCard key={product.id} {...product} index={index} />
  ));
}
