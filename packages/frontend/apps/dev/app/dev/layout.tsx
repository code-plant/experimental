import { PropsWithChildren } from "react";
import { ClientLayout } from "./ClientLayout";

import "./style.css";

export default function Layout({ children }: PropsWithChildren) {
  return <ClientLayout>{children}</ClientLayout>;
}
