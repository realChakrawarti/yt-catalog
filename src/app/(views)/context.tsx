"use client";

import AuthContextProvider from "~/app/auth/context-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthContextProvider>{children}</AuthContextProvider>
    </NextThemesProvider>
  );
}
