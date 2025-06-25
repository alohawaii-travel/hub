import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Call the API to register the user
async function registerUserInApi(user: { email: string; name?: string | null; image?: string | null }) {
  try {
    const response = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/external/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.HUB_API_KEY || '',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        image: user.image,
        provider: 'google',
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to register user in API:', await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering user in API:', error);
    return null;
  }
}

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

        // Register or update user in the API database
        await registerUserInApi({
          email: user.email || "",
          name: user.name,
          image: user.image,
        });
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
