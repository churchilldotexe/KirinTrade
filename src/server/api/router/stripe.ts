import { createTRPCRouter } from "../trpc";

export const stripeRouter = createTRPCRouter({

});

    //const {
    //  orders: [order],
    //} = await db.user.upsert({
    //  where: { email },
    //  create: userFields,
    //  update: userFields,
    //  select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    //});
