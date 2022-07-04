import type { Dish, Order, OrderItem } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/services/db.server";

interface LoaderData {
  order: Order & {
    items: (OrderItem & {
      dish: Dish;
    })[];
  };
}

export default function OrderConfirmed() {
  const { order } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Order Confirmed</h1>
      <p>Your order has been placed</p>
      <h2>Items:</h2>
      <ul>
        {order.items.map((item) => {
          return <li key={item.id}>{item.dish.name}</li>;
        })}
      </ul>
      Total: {order.items.reduce((total, item) => total + item.dish.price, 0)}€
      <Link to={`/`}>Place another order</Link>
    </div>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  const order = await db.order.findFirst({
    where: {
      tableNumber: Number(params.tableNumber),
      id: Number(params.orderId),
    },
    include: {
      items: {
        include: {
          dish: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return {
    order,
  } as LoaderData;
};
