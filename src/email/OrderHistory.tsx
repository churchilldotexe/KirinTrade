import OrderInformation from "@/email/components/OrderInformation";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import React from "react";

type OrderHistoryEmailEmailProps = {
  orders: {
    downloadVerificationId: string;
    pricePaidInCents: number | null;
    orderId: string | null;
    createdAt: Date | null;
    productName: string | null;
    imagePath: string | null;
    description: string | null;
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      orderId: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 10000,
      downloadVerificationId: crypto.randomUUID(),
      productName: "Product name",
      description: "Some description",
      imagePath:
        "/products/b7f81402-5c04-4863-8b9c-2d2312d3e6c6-matthew-kwong-XVhgrKy8C4g-unsplash.jpg",
    },
    {
      orderId: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 13000,
      downloadVerificationId: crypto.randomUUID(),
      productName: "Product name 2",
      description: "Some description other",
      imagePath:
        "/products/951be367-d9c1-47ab-94f6-c98f5e3b1c2c-c-d-x-dBwadhWa-lI-unsplash.jpg",
    },
  ],
} satisfies OrderHistoryEmailEmailProps;

export default function OrderHistoryEmail({
  orders,
}: OrderHistoryEmailEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Preview>Order History and Downloads</Preview>
        <Head />
        <Body className="bg-white font-sans">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.orderId}>
                <OrderInformation
                  order={{
                    id: order.orderId as string,
                    createdAt: order.createdAt as Date,
                    pricePaidInCents: order.pricePaidInCents as number,
                  }}
                  product={{
                    imagePath: order.imagePath as string,
                    name: order.productName as string,
                    description: order.description as string,
                  }}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
