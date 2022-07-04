import type { Dish, Order, OrderItem } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/services/db.server";

interface LoaderData {
  orders: (Order & {
    items: (OrderItem & {
      dish: Dish;
    })[];
  })[];
}

export default function Internal() {
  const { orders } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Order Overview</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Order for table #{order.tableNumber}</p>
              <ul>
                {order.items.map((item) => {
                  return <li key={item.id}>{item.dish.name}</li>;
                })}
              </ul>
              Total:{" "}
              {order.items.reduce((total, item) => total + item.dish.price, 0)}€
              <Form method="delete">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="submit" value="Completed" />
              </Form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const loader: LoaderFunction = async () => {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          dish: true,
        },
      },
    },
    where: {
      completed: false,
    },
  });

  return {
    orders,
  } as LoaderData;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  switch (request.method) {
    case "DELETE":
      const orderId = formData.get("orderId") as string;
      await db.order.update({
        where: {
          id: Number(orderId),
        },
        data: {
          completed: true,
        },
      });
      return {};
  }
};
