import PageHeader from "@/components/admin-dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { Plus } from "lucide-react";
import Link from "next/link";

const AdminProductPage = async () => {
  const productsData = await db.product.findMany({
    select: {
      name: true,
      id: true,
      isAvailableforPurchase: true,
      priceInCents: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (productsData.length === 0)
    return <AddProducts href="/admin/products/new" />;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href={"/admin/products/new"}>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
};

const AddProducts = ({ href }: { href: string }) => {
  return (
    <div className="relative h-[80dvh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 lg:gap-10">
        <h1 className="text-center text-3xl lg:text-4xl">
          No Product Found... Add a Product
        </h1>
        <Button asChild variant={"ghost"} className=" text-6xl">
          <Link
            href={href}
            className="h-36 w-36 cursor-pointer border border-dashed lg:h-48 lg:w-48"
          >
            <Plus className="h-full w-full  text-gray-300" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ProductsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
};

export default AdminProductPage;
