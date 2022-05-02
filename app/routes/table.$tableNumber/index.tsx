import { Dish, Order } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { db } from "~/services/db.server";

interface LoaderData {
    dishes: Dish[]
}

type OrderData = {
    dish: {
        id: string
    }
}[]

type Item = {
    dish: Dish;
}

export default function Ordering() {
    const { dishes } = useLoaderData<LoaderData>();


    const [order, setOrder] = useState<Item[]>([]);

    return <div>
        <h1>Current Order</h1>
        <ul>
            {order.map((dish, index) => {
                return <li>{dish.dish.name} <button onClick={() => setOrder(
                    order.filter((_, i) => i !== index)
                )}>Remove</button></li>
            })}
        </ul>
        Total: {order.reduce((total, dish) => total + dish.dish.price, 0)}€
        <Form method="post">
            <input type="hidden" name="data" value={JSON.stringify(order.map(item => {
                return {
                    dish: {
                        id: item.dish.id
                    }
                }
            }))} />
            <input type="submit" value="Place Order" />
        </Form>

        <h1>Available Dishes</h1>
        <ul>
            {dishes.map(dish => {
                return <li>{dish.name} <button onClick={() => setOrder([...order, { dish }])}>Buy</button></li>
            })}
        </ul>
    </div>
}

export const loader: LoaderFunction = async () => {
    const dishes = await db.dish.findMany();

    return {
        dishes
    }
};

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();

    const data = JSON.parse(formData.get("data") as string) as Item[];

    const order = await db.order.create({
        data: {
            tableNumber: Number(params.tableNumber),
            items: {
                createMany: {
                    data: data.map(item => {
                        return {
                            dishId: item.dish.id
                        }
                    })
                }
            }
        }
    });

    return redirect(`/table/${params.tableNumber}/order/${order.id}`);
};