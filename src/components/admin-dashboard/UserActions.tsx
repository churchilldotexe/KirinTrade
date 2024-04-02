"use client";
import { deleteUser } from "@/app/admin/_actions/user";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

type DeleteDropdownUserProps = {
  id: string;
};

export function DeleteDropdownUser({ id }: DeleteDropdownUserProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => await deleteUser(id));
      }}
    >
      Delete User
    </DropdownMenuItem>
  );
}
