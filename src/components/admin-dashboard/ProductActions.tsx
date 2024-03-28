"use client";

import {
  deleteProduct,
  toggleProductAvailability,
} from "@/app/admin/_actions/product";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

export function ActiveToggleDropdownItem({
  id,
  isAvaialableForPurchase,
}: {
  id: string;
  isAvaialableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvaialableForPurchase);
        });
      }}
    >
      {isAvaialableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
        });
      }}
      className="text-red-500"
    >
      Delete
    </DropdownMenuItem>
  );
}
