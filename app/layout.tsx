import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import NetworkIdentitySync from "./components/NetworkIdentitySync";
import "./globals.scss";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Страна Улыбок",
  description: "Детский развивающий центр",
  icons: {
    icon: "/favicon.ico?v=house-20260505",
    shortcut: "/favicon.ico?v=house-20260505",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body className={nunito.variable}>
          <NetworkIdentitySync />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
