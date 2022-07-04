import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/services/db.server";

import styles from "~/styles/app.css";
import ordering from "~/styles/ordering.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: ordering },
  ];
}

interface LoaderData {
  tables: {
    tableNumber: number;
  }[];
}

export default function Index() {
  const { tables } = useLoaderData<LoaderData>();

  return (
    <div className="card">
      <h1>Welcome to Restaurando!</h1>
      <p>Please select your table to continue!</p>
      <div className="table-grid">
        {tables.map((table) => {
          return (
            <Link
              key={table.tableNumber}
              to={`/table/${table.tableNumber}`}
              className="no-link inline"
            >
              <button className="table">{table.tableNumber}</button>
            </Link>
          );
        })}
      </div>
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
