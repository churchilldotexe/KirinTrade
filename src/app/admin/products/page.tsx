import Loading from "@/app/admin/products/loading";
import PageHeader from "@/components/admin-dashboard/PageHeader";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "@/components/admin-dashboard/ProductActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatter";
import { serverClient } from "@/trpc/serverClient";
import { CheckCircle2, MoreVertical, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminProductPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href={"/admin/products/new"}>Add Product</Link>
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <ProductsTable />
      </Suspense>
    </>
  );
}

// render when no products found
const RenderWhenNoProducts = ({ href }: { href: string }) => {
  return (
    <div className="relative h-[80dvh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 lg:gap-10">
        <h1 className="text-center text-3xl lg:text-4xl">
          No Products Found... Add a Product
        </h1>
        <Button asChild variant={"ghost"} className="text-6xl ">
          <Link
            href={href}
            className="h-36 w-36 cursor-pointer rounded-3xl border border-dashed hover:bg-muted lg:h-48 lg:w-48"
          >
            <Plus className="h-full w-full text-gray-300" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ProductsTable = async () => {
  const productsData = await serverClient.admin.products.getAllProductsData();

  if (productsData.length === 0)
    return <RenderWhenNoProducts href="/admin/products/new" />;

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
      <TableBody>
        {productsData.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableforPurchase ? (
                <>
                  <CheckCircle2 className="stroke-green-600 " />
                  <span className="sr-only">Available</span>
                </>
              ) : (
                <>
                  <XCircle className="stroke-destructive" />
                  <span className="sr-only">Not-Available</span>
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{product.ordersCount}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`./products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`./products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={product.id}
                    isAvaialableForPurchase={product.isAvailableforPurchase}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product.ordersCount > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
