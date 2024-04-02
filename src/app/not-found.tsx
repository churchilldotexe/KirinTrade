import { Button } from "@/components/ui/button";
import { SeparatorVerticalIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 m-auto h-fit w-fit">
      <div className="mx-auto space-y-4">
        <div className="flex items-center gap-4 md:text-2xl lg:text-4xl">
          <h2>Not Found</h2>
          <SeparatorVerticalIcon />
          <p>Could not find requested resource</p>
        </div>
        <div className="flex justify-center">
          <Button asChild className=" w-full md:w-1/3 lg:w-2/3">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
