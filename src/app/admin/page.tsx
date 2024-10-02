import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { serverClient } from "@/trpc/serverClient";

export default async function AdminDashBoard() {
  const [salesData, UserData, productData] = await Promise.all([
    serverClient.admin.dashboard.getSaleData(),
    serverClient.admin.dashboard.getUserData(),
    serverClient.admin.dashboard.getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashBoardCard
        title="Sales"
        subtitle={`${formatNumber(salesData?.numberOfSales ?? 0)} Orders`}
        body={formatCurrency(salesData?.amount ?? 0)}
      />
      <DashBoardCard
        title="Customer"
        subtitle={`${formatCurrency(UserData?.averageValuePerUser ?? 0)} Average Value`}
        body={formatNumber(UserData?.userCount ?? 0)}
      />
      <DashBoardCard
        title="Active Products"
        subtitle={`${formatNumber(productData?.inactiveCount ?? 0)} inactive products`}
        body={`${formatNumber(productData?.activeCount ?? 0)} active products`}
      />
    </div>
  );
}

interface DashBoardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

const DashBoardCard = ({ title, subtitle, body }: DashBoardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};
