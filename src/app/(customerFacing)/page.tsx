import ProductCard from "@/components/ProductCard";
import SkeletonLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { type SORT_METHOD } from "@/lib/constants";
import { serverClient } from "@/trpc/serverClient";
import Link from "next/link";
import { Suspense } from "react";

export default async function functionHomePage() {
  const getNewestOrder = serverClient.products.getNewestProducts();
  const getMostPopularOrder = serverClient.products.getPopularProducts();

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

type productFetcherReturnType = ReturnType<
  (typeof serverClient)["products"]["getNewestProducts"]
>;

type ProductGridSectionProps = {
  title: string;
  productFetcher: productFetcherReturnType;
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
  productFetcher: productFetcherReturnType;
}) {
  return (await productFetcher).map((product, index) => (
    <ProductCard key={product.id} {...product} index={index} />
  ));
}
