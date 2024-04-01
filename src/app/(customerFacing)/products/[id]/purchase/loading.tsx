import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="item fixed inset-0 flex justify-center ">
      <Loader2 className="animate-spin text-slate-500" />
    </div>
  );
}
