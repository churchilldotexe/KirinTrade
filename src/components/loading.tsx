import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <>
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="flex animate-pulse flex-col overflow-hidden ">
      <Skeleton className="relative aspect-video h-auto w-full bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-2/4 bg-gray-200" />
        </CardTitle>
        <div>
          <Skeleton className="h-6 w-1/4 bg-gray-200" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-2/4 bg-gray-200" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full bg-gray-300" />
      </CardFooter>
    </Card>
  );
}
