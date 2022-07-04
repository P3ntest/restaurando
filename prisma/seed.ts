import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await db.table.deleteMany();
  await db.dish.deleteMany();
  await db.order.deleteMany();

  await db.table.createMany({
    data: [
      ...Array(69)
        .fill({})
        .map((_, i) => {
          return {
            tableNumber: i + 1,
          };
        }),
    ],
  });

  await db.dish.createMany({
    data: [
      {
        name: "🍕 Pizza",
        price: 9.45,
      },
      {
        name: "🍝 Pasta Bolognese",
        price: 8.5,
      },
      {
        name: "🥪 Sandwich",
        price: 12.5,
      },
      {
        name: "🦐 Fried Shrimps",
        price: 7.5,
      },
      {
        name: "🍔 Classic Burger",
        price: 5,
      },
      {
        name: "🍟 Bag of chips",
        price: 4.5,
      },
      {
        name: "🥤 Coca Cola",
        price: 1.5,
      },
      {
        name: "🥤 Coca Cola Zero",
        price: 1.5,
      },
      {
        name: "🥤 Fanta",
        price: 1.5,
      },
      {
        name: "🥤 Sprite",
        price: 1.5,
      },
      {
        name: "🧋 Bubble Tea",
        price: 4,
      },
      {
        name: "💧 Sparkling Water",
        price: 1.5,
      },
    ],
  });

  console.log("done");
}

seed();
