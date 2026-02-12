import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mentor Admin",
  description: "Admin portal for AI Mentor Selection Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{
            marginLeft: '280px',
            padding: '2rem',
            width: 'calc(100% - 280px)',
            minHeight: '100vh'
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
