import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Domain whitelisting - only allow specific email domains
      const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",") || [];

      if (user.email) {
        const emailDomain = user.email.split("@")[1];
        if (
          allowedDomains.length > 0 &&
          !allowedDomains.includes(emailDomain)
        ) {
          return false; // Reject sign in for non-whitelisted domains
        }
      }

      return true;
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
