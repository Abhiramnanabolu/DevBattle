// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id field here
      // other properties if needed
    } & DefaultSession["user"];
  }
}
