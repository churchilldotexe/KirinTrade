import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const DM = DM_Sans({
  subsets: ["latin"],
  variable: "--DM-sans",
});

export const metadata = {
  title: "Kirin Trade",
  description: "An E-commerce app",
  icons: [{ rel: "icon", url: "/kirin-logo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          DM.variable,
        )}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
