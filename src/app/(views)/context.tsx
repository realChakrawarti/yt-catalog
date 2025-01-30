"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import AuthContextProvider from "~/app/auth/context-provider";
import { SidebarProvider } from "~/components/shadcn/sidebar";

export default function Providers({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthContextProvider>
        <SidebarProvider>
          <div className="flex flex-grow min-h-screen">{children}</div>
          <ProgressBar
            startPosition={0.8}
            height="4px"
            color="#e11d48"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </SidebarProvider>
      </AuthContextProvider>
    </NextThemesProvider>
  );
}
