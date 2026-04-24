import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaContextType {
  isInstallable: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  triggerInstall: () => Promise<{ outcome: string }>;
}

export const PwaContext = createContext<PwaContextType | null>(null);

PwaContext.displayName = "PwaContext";

export const PwaProvider = ({ children }: { children: React.ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // This event is fired only on supported browser (No iOS or Safari)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();

      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  // This function manually triggers the native PWA installation prompt.
  // It will be used when the user clicks “Install app”
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { outcome: "dismissed" };
    }

    const promptEvent = deferredPrompt;
    setDeferredPrompt(null);
    setIsInstallable(false);

    // Show the browser's native install prompt
    promptEvent.prompt();

    // Wait for the user's choice
    const { outcome } = await promptEvent.userChoice;

    return { outcome };
  }, [deferredPrompt]);

  const value = {
    isInstallable,
    deferredPrompt,
    triggerInstall,
  };

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export const usePwa = () => {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    throw new Error("usePWA must be used within PWAProvider");
  }
  return ctx;
};
