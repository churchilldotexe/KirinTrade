import PageHeader from "@/components/admin-dashboard/PageHeader";
import ProductForm from "@/components/admin-dashboard/ProductForm";
import { serverClient } from "@/trpc/serverClient";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await serverClient.products.getMyProduct(id);

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
