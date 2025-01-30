import {Geist, Geist_Mono} from "next/font/google";
import {ThemeProvider} from "next-themes"
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "iLinker",
    description: "Description about iLinker",
};
import { Inter } from 'next/font/google';
import Header from '@/components/header';

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
            <Header />
            <main>{children}</main>
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
