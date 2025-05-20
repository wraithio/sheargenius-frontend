import type { Metadata } from "next";
import "./globals.css";
// import ChatbotComponent from "@/components/ChatbotComponent";
import { Suspense } from "react";
import BuzzbyComponent from "@/components/BuzzbyComponent";
// import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "ShearGenius",
  description: "A Hub For All Things Hair",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/sheargeniuspng.png"
          type="image/png"
          sizes="32x32"
        />
        {/* <ChatbotComponent/> */}
      </head>
      <body className={`antialiased`}>
        <Suspense>
        {children}
          <BuzzbyComponent/>
        </Suspense>
        </body>
    </html>
  );
}
