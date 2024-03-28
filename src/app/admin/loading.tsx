import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 flex-grow rounded-full bg-slate-200" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-3 flex-grow rounded-full" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 flex-grow rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
