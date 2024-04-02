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
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 10000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name",
        description: "Some description",
        imagePath:
          "/products/b7f81402-5c04-4863-8b9c-2d2312d3e6c6-matthew-kwong-XVhgrKy8C4g-unsplash.jpg",
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 13000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name 2",
        description: "Some description other",
        imagePath:
          "/products/951be367-d9c1-47ab-94f6-c98f5e3b1c2c-c-d-x-dBwadhWa-lI-unsplash.jpg",
      },
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
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
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
