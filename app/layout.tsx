import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.scss";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Страна Улыбок",
  description: "Детский развивающий центр",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunito.variable}>
        {children}
      </body>
    </html>
  );
}