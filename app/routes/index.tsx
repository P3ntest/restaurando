import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/services/db.server";

interface LoaderData {
  tables: {
    tableNumber: number;
  }[];
}

export default function Index() {
  const { tables } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Welcome to Restaurando!</h1>
      <p>Please select your table to continue</p>
      {tables.map((table) => {
        return (
          <Link key={table.tableNumber} to={`/table/${table.tableNumber}`}>
            <button>{table.tableNumber}</button>
          </Link>
        );
      })}
    </div>
  );
}

export const loader: LoaderFunction = async () => {
  const tables = await db.table.findMany({
    select: {
      tableNumber: true,
    },
  });

  return {
    tables,
  } as LoaderData;
};
