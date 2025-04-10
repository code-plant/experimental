import { ModeContextProvider } from "@this-project/frontend-util-mode-next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const theme = (await cookies()).get("theme");

  return (
    <html
      className={theme?.value === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="/script/mode.js" />
      </head>
      <body>
        <ModeContextProvider
          variableName="npm:@-ft/mode-codegen"
          ssrInitialMode={theme?.value || "light"}
        >
          {children}
        </ModeContextProvider>
      </body>
    </html>
  );
}
