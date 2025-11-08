import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flex Living - Reviews Dashboard",
  description: "Manage and display property reviews for Flex Living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

