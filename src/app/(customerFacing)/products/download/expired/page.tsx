import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col  items-center justify-center pt-5">
      <h1 className="mb-4 text-4xl md:text-center lg:text-5xl">
        Download link expired
      </h1>
      <Button asChild size={"lg"} className="w-1/2 text-lg md:w-1/3">
        <Link href={"/orders"}>Get new Link</Link>
      </Button>
    </div>
  );
}
