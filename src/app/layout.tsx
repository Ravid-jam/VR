"use client";
import Loader from "@/components/common/Loader";
import "@/css/satoshi.css";
import "@/css/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0,
    },
  },
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Dhanani</title>
      </head>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <QueryClientProvider client={queryClient}>
            <ToastContainer />
            {loading ? <Loader /> : children}
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}
