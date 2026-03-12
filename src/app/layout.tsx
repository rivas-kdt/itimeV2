// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "iTime - Time Management App",
  description: "Manage your time effectively with iTime.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
