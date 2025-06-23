import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Additional middleware logic can go here
    console.log("Middleware running for:", req.nextUrl.pathname);

    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages and home page without token
        if (req.nextUrl.pathname.match(/\/(auth|$)/)) {
          return true;
        }

        // Check if user has a valid token for protected routes
        if (!token) return false;

        // Additional authorization logic can go here
        // For example, role-based access control

        return true;
      },
    },
  }
);

// Protect these routes with auth
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
