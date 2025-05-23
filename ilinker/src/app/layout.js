import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import ManagerHeader from "@/components/managerHeader";
import { LoaderContext, LoaderProvider } from "@/contexts/LoaderContext";

export const metadata = {
  title: "iLinker",
  description: "Description about iLinker",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LoaderProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ManagerHeader />
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
