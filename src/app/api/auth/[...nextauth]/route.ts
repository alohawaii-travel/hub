import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Call the API to authenticate and check user status
async function authenticateUserWithApi(user: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  try {
    const response = await fetch(
      `${
        process.env.API_URL || "http://localhost:4000"
      }/api/internal/users/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.HUB_API_KEY || "",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: "google",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("User authentication failed:", result.error);
      return {
        success: false,
        error: result.error,
        statusCode: response.status,
        isPending:
          response.status === 403 && result.error?.includes("pending approval"),
      };
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error authenticating user with API:", error);
    return { success: false, error: "Authentication service unavailable" };
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
      if (user.email) {
        // Authenticate user with API and check their status
        const authResult = await authenticateUserWithApi({
          email: user.email || "",
          name: user.name,
          image: user.image,
        });

        if (!authResult.success) {
          // Log the specific error for debugging
          console.error(
            `Sign-in rejected for ${user.email}:`,
            authResult.error
          );

          // If user is pending, allow sign-in but mark for redirect
          if (authResult.isPending) {
            console.log(
              `User ${user.email} has pending status - allowing sign-in for redirect`
            );
            return true; // Allow sign-in so we can redirect to pending page
          }

          // For other errors, block sign-in completely
          return false;
        }

        console.log(
          `Sign-in approved for ${user.email} with role ${authResult.user?.role}`
        );
        return true;
      }

      return false; // No email provided
    },
    async jwt({ token }) {
      // Always check user status with API to get latest role/status
      if (token.email) {
        const authResult = await authenticateUserWithApi({
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
        });

        token.isPending = !authResult.success && authResult.isPending;
        token.userRole = authResult.user?.role || token.userRole;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user status to session
      session.user.isPending = token.isPending as boolean;
      session.user.role = token.userRole as string;
      return session;
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
