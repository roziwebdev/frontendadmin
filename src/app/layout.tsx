import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import LoggedInLayout from "@/components/Layout/LoggedInLayout";
import LoggedOutLayout from "@/components/Layout/LoggedOutLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/AuthOption";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Session diambil di server-side
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
      <link
      rel="icon"
      href="/icon?<generated>"
      type="image/<generated>"
      sizes="<generated>"
    />
      </head>
      <body className={inter.className}>
        <ToastProvider />
        <NextAuthProvider>
          {session ? (
            <LoggedInLayout>{children}</LoggedInLayout>
          ) : (
            <LoggedOutLayout>{children}</LoggedOutLayout>
          )}
        </NextAuthProvider>
      </body>
    </html>
  );
}
