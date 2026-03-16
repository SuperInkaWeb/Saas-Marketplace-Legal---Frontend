"use client";

import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}