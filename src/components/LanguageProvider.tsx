"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api";

type Language = "en" | "ko" | "ja";

interface Messages {
  [key: string]: string | Messages;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  messages: Messages;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback values for SSR or when provider is not available
    return {
      language: "en" as Language,
      setLanguage: () => {},
      messages: {},
    };
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialMessages: Messages;
}

// Browser language detection
function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith("ko")) return "ko";
  if (browserLang.startsWith("ja")) return "ja";

  return "en";
}

// Get saved language from localStorage or detect from browser
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem("language") as Language;
  if (saved && ["en", "ko", "ja"].includes(saved)) {
    return saved;
  }

  return detectBrowserLanguage();
}

export function LanguageProvider({
  children,
  initialMessages,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");
  const [messages, setMessages] = useState(initialMessages);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Set initial language after hydration
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    setIsHydrated(true);

    // Load messages for the detected language if different from default
    if (initialLang !== "en") {
      loadMessages(initialLang);
    }
  }, []);

  const loadMessages = async (lang: Language) => {
    try {
      // Direct import is faster and more reliable than API calls
      const messageModule = await import(`../../messages/${lang}.json`);
      setMessages(messageModule.default);
    } catch (error) {
      console.error("Failed to load messages:", error);
      // Fallback to English
      try {
        const englishModule = await import(`../../messages/en.json`);
        setMessages(englishModule.default);
      } catch (fallbackError) {
        console.error("Failed to load fallback messages:", fallbackError);
        setMessages({});
      }
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    // Load new messages
    await loadMessages(lang);

    // Save to user profile if logged in
    if (session?.user) {
      try {
        await apiClient.updateCurrentUser({ language: lang });
      } catch (error) {
        console.error("Failed to save language preference to profile:", error);
      }
    }
  };

  // Don't render until hydrated to avoid hydration mismatches
  if (!isHydrated) {
    return (
      <NextIntlClientProvider
        locale="en"
        messages={initialMessages}
        timeZone="Pacific/Honolulu"
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, messages }}>
      <NextIntlClientProvider
        locale={language}
        messages={messages}
        timeZone="Pacific/Honolulu"
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}
