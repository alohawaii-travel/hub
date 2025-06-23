import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlohaWaii Staff Hub",
  description: "Staff management dashboard for AlohaWaii tours",
};

// Load default English messages
async function getMessages() {
  try {
    const messages = (await import("../../locales/en.json")).default;
    return messages;
  } catch (error) {
    console.error("Failed to load default messages:", error);
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LanguageProvider initialMessages={messages}>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
