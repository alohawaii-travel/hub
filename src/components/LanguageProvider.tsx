"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { apiClient } from "@/lib/api";

type Language = "en" | "ko" | "ja";

interface Messages {
  [key: string]: string | Messages;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  messages: Messages;
}

// Extend the session user type to include language
interface UserWithLanguage {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  language?: Language;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: async () => {},
  messages: {},
});

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide fallback values during SSR or when provider is missing
    return {
      language: "en" as Language,
      setLanguage: async () => {},
      messages: {},
    };
  }
  return context;
}

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ko")) return "ko";
  if (browserLang.startsWith("ja")) return "ja";
  return "en";
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialMessages?: Messages;
}

export function LanguageProvider({
  children,
  initialMessages = {},
}: LanguageProviderProps) {
  const { data: session, status } = useSession();
  const [language, setLanguageState] = useState<Language>("en");
  const [messages, setMessages] = useState<Messages>(initialMessages);

  const loadMessages = async (lang: Language) => {
    try {
      const messages = await import(`../../locales/${lang}.json`);
      setMessages(messages.default);
    } catch (error) {
      console.error(`Failed to load messages for ${lang}:`, error);
      // Fallback to English if loading fails
      if (lang !== "en") {
        try {
          const fallbackMessages = await import(`../../locales/en.json`);
          setMessages(fallbackMessages.default);
        } catch (fallbackError) {
          console.error("Failed to load fallback messages:", fallbackError);
        }
      }
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    await loadMessages(lang);

    // Only try to update user profile if user is authenticated, session is loaded, and we have a user
    if (status === "authenticated" && session?.user && session.user.email) {
      try {
        await apiClient.updateCurrentUser({ language: lang });
        console.log(`Language preference saved to profile: ${lang}`);
      } catch (error) {
        console.warn(
          "Failed to save language preference to user profile:",
          error
        );
        // Don't throw error - language switching should still work locally
      }
    } else {
      console.log(`Language preference saved locally: ${lang} (status: ${status})`);
    }
  };

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      let initialLang: Language = "en";

      // Only check user language if session is fully loaded and user is authenticated
      const userWithLanguage = session?.user as UserWithLanguage;
      if (status === "authenticated" && session?.user && userWithLanguage?.language) {
        // User is authenticated and has a saved language preference
        initialLang = userWithLanguage.language;
      } else if (status !== "loading") {
        // Session is loaded (either authenticated or not), check localStorage and browser
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && ["en", "ko", "ja"].includes(savedLang)) {
          initialLang = savedLang;
        } else {
          initialLang = detectBrowserLanguage();
        }
      }

      setLanguageState(initialLang);
      await loadMessages(initialLang);
    };

    // Only initialize when session status is not loading
    if (status !== "loading") {
      initializeLanguage();
    }
  }, [session, status]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, messages }}>
      <NextIntlClientProvider
        messages={messages}
        locale={language}
        timeZone="Pacific/Honolulu"
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}
