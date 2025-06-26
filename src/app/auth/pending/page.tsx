"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PendingApprovalPage() {
  const t = useTranslations("auth.pending");
  // Auto sign out after a delay to clear the session
  useEffect(() => {
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/auth/signin" });
    }, 10000); // Auto sign out after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <Image
              src="/logo-lg.png"
              alt="AlohaWaii"
              width={150}
              height={48}
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("title")}
          </h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {t("adminApprovalRequired")}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{t("accountCreated")}</p>
                <p className="mt-2">{t("contactAdmin")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t("autoSignOut")}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("signOutNow")}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">{t("errorContact")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
