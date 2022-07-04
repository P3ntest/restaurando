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
  tableNumber: number;
}

export default function OrderConfirmed() {
  const { order, tableNumber } = useLoaderData<LoaderData>();

  return (
    <div className="card">
      <h1>✔️ Order Confirmed</h1>
      <p>Your order has been placed. Your food should arrive shortly.</p>
      <div>
        <h2>Order Recap:</h2>
        <ul>
          {order.items.map((item) => {
            return <li key={item.id}>{item.dish.name}</li>;
          })}
        </ul>
        Total: {order.items.reduce((total, item) => total + item.dish.price, 0)}
        €
      </div>
      <br />
      <p>
        Want to order more?{" "}
        <Link to={`/table/${tableNumber}`}>Place another order</Link>
      </p>
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
    tableNumber: Number(params.tableNumber),
  } as LoaderData;
};
