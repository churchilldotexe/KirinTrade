import ProductCard from "@/components/ProductCard";
import SkeletonLoading from "@/components/loading";
import { SORT_METHOD } from "@/lib/constants";
import { serverClient } from "@/trpc/serverClient";
import { Suspense } from "react";

export default function ProductsPage({
  searchParams: { orderBy },
}: {
  searchParams: { orderBy: keyof typeof SORT_METHOD };
}) {
  const orderByWithFallback =
    orderBy === "newest" || orderBy === "popular" ? orderBy : "name";
  const sortingMethod = SORT_METHOD[orderByWithFallback];

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
  const products = await serverClient.products.getAllProducts({
    sortby: orderBy,
  });
  return products.map((product, index) => (
    <ProductCard key={product.id} {...product} index={index} />
  ));
}
