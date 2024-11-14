"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import AuthContextProvider from "~/app/auth/context-provider";

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
