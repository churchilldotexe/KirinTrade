import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";

const getSaleData = async () => {
  const data = await db.order.aggregate({
    _sum: { pricePaidinCents: true },
    _count: true,
  });

  return {
    amount: (data._sum?.pricePaidinCents ?? 0) / 100,
    numberOfSales: data._count,
  };
};

const getUserData = async () => {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidinCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount ?? (orderData._sum.pricePaidinCents ?? 0) / userCount / 100,
  };
};

const getProductData = async () => {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableforPurchase: true } }),
    db.product.count({ where: { isAvailableforPurchase: false } }),
  ]);
  return {
    activeCount,
    inactiveCount,
  };
};

export default async function AdminDashBoard() {
  const [salesData, UserData, productData] = await Promise.all([
    getSaleData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashBoardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashBoardCard
        title="Customer"
        subtitle={`${formatCurrency(UserData.averageValuePerUser)} Average Value`}
        body={formatNumber(UserData.userCount)}
      />
      <DashBoardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} inactive products`}
        body={`${formatNumber(productData.activeCount)} active products`}
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
