import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { Inter } from "next/font/google";
import NavBar from "@/components/navBar/navBar";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "iLinker",
  description: "Description about iLinker",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LoaderProvider>
            <NavBar />
            <main>{children}</main>
            <Toaster />
          </LoaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}