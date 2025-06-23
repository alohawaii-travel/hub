import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Additional middleware logic can go here
    console.log("Middleware running for:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Check if user has a valid token
        if (!token) return false;

        // Additional authorization logic can go here
        // For example, role-based access control

        return true;
      },
    },
  }
);

// Protect these routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/internal/:path*"],
};
