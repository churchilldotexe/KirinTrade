import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
          <TableHead className="w-5/12">Name</TableHead>
          <TableHead className="w-3/12">Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRowLoading />
        <TableRowLoading />
        <TableRowLoading />
      </TableBody>
    </Table>
  );
}

function TableRowLoading() {
  return (
    <TableRow>
      <TableCell>
        <Loader2 className=" invisible" />
      </TableCell>
      <TableCell>
        <Loader2 className="animate-spin  text-slate-400" />
      </TableCell>
      <TableCell>
        <Loader2 className="animate-spin text-slate-400" />
      </TableCell>
      <TableCell>
        <Loader2 className="animate-spin text-slate-400" />
      </TableCell>
      <TableCell>
        <Loader2 className="invisible" />
      </TableCell>
    </TableRow>
  );
}
