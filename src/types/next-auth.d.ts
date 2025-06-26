import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      isPending?: boolean;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    isPending?: boolean;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isPending?: boolean;
    userRole?: string;
  }
}
