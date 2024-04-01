import { Loader2 } from "lucide-react";

export default function FormLoading() {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center transition-all">
      <Loader2 className=" w-10 animate-spin" />
    </div>
  );
}
