"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

export default function RootLayout({ children }) {
  const query = new QueryClient()
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <QueryClientProvider client={query}>
        {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
