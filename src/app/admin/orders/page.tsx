import { DeleteDropdownOrder } from "@/components/admin-dashboard/OrderAction";
import {
  DropdownMenu,
  DropdownMenuContent,
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
//import db from "@/db/db";
import { formatCurrency } from "@/lib/formatter";
import { serverClient } from "@/trpc/serverClient";
import { MoreVertical } from "lucide-react";

async function ProductsData() {
  return await serverClient.admin.orders.getOrderOverview();
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Sales</h1>
      <CustomerTable />
    </div>
  );
}

async function CustomerTable() {
  const orders = await ProductsData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          return (
            <TableRow key={order.id}>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>
                {formatCurrency(order.pricePaidInCents / 100)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropdownOrder id={order.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
