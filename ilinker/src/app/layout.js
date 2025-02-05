import {ThemeProvider} from "next-themes"
import "./globals.css";

export const metadata = {
    title: "iLinker",
    description: "Description about iLinker",
};

import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import ManagerHeader from "@/components/managerHeader";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({children}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
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
        </body>
        </html>
        // <html lang="en">
        //   <body
        //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        //   >
        //     {children}
        //   </body>
        // </html>
    );
}
