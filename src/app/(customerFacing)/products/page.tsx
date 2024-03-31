import ProductCard from "@/components/ProductCard";
import SkeletonLoading from "@/components/loading";
import { SORT_METHOD } from "@/config";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProducts = cache(
  (orderBy) => {
    return db.product.findMany({
      where: { isAvailableforPurchase: true },
      // @ts-expect-error argument use for sorting the product
      orderBy,
    });
  },
  ["/products", "getProducts"],
);

export default function ProductsPage({
  searchParams: { orderBy },
}: {
  searchParams: { orderBy: keyof typeof SORT_METHOD };
}) {
  const sortingMethod = SORT_METHOD[orderBy];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={
          <>
            <SkeletonLoading />
            <SkeletonLoading />
          </>
        }
      >
        <RenderSuspendedProduct orderBy={sortingMethod} />
      </Suspense>
    </div>
  );
}

interface RenderSuspendedProductProps {
  orderBy: (typeof SORT_METHOD)[keyof typeof SORT_METHOD];
}

async function RenderSuspendedProduct({
  orderBy,
}: RenderSuspendedProductProps) {
  const products = await getProducts(orderBy);
  return products.map((product, index) => (
    <ProductCard key={product.id} {...product} index={index} />
  ));
}
