import React from "react";

import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface TanstackProviderProps {
  children: React.ReactNode;
}

const client = new QueryClient();

function TanstackProvider({ children }: TanstackProviderProps) {
  useReactQueryDevTools(client);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default TanstackProvider;
