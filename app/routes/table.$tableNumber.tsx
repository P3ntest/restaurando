import { Outlet } from "@remix-run/react";

import styles from "~/styles/app.css";
import ordering from "~/styles/ordering.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: ordering },
  ];
}

export default function Wrapper() {
  return <Outlet />;
}
