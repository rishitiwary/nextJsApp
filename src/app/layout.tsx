import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
// THEME PROVIDER
import StyledComponentsRegistry from "@lib/registry";
// APP PROVIDER
import { AppProvider } from "@context/app-context";
import StyledContext from "@context/StyledContext";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grozep",
  description:
    "Grozep description",
  authors: [{ name: "grozep", url: "https://grozep.com" }],
  keywords: ["grozep", "grozep"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <StyledComponentsRegistry>
          <AppProvider>
            <StyledContext>{children}</StyledContext>
          </AppProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
