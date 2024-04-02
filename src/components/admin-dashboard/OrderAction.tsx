"use client";
import { deleteOrder } from "@/app/admin/_actions/order";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

type DeleteDropdownUserProps = {
  id: string;
};

export function DeleteDropdownOrder({ id }: DeleteDropdownUserProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => await deleteOrder(id));
      }}
    >
      Delete Order
    </DropdownMenuItem>
  );
}
