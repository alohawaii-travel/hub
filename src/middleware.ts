import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // If user is pending and not already on pending page, redirect
    if (token?.isPending && !req.nextUrl.pathname.startsWith("/auth/pending")) {
      console.log("Redirecting pending user to pending page");
      return NextResponse.redirect(new URL("/auth/pending", req.url));
    }

    // If user is not pending and on pending page, redirect to home
    if (!token?.isPending && req.nextUrl.pathname.startsWith("/auth/pending")) {
      console.log("Redirecting non-pending user away from pending page");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("Middleware running for:", req.nextUrl.pathname);
    return NextResponse.next();
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

        // Allow access for all authenticated users (including pending)
        // The middleware function above will handle pending user redirects
        return true;
      },
    },
  }
);

// Protect these routes with auth
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/signin (sign-in page only, not pending page)
     * - logo files and other static assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signin|logo-|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
