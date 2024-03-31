export const SORT_METHOD = {
  popular: { orders: { _count: "desc" } },
  newest: { createdAt: "desc" },
  name: { name: "asc" },
};
