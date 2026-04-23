import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";

import App from "./App.tsx";

import { AuthProvider } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PwaProvider } from "./context/PWAContext/PWAContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PwaProvider>
          <CssBaseline />
          <App />
        </PwaProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

// Register service worker in production only
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("[SW] Registration failed:", error);
    });
  });
}
