import NextAuth from "next-auth";
// import { authConfig } from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

import db from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: String(token.id),
        };
      }

      return session;
    },
    async signIn({ profile }) {
      try {
        if (profile) {
          const existingUser = await db.user.findUnique({
            where: { email: profile.email },
          });
          if (!existingUser) {
            const user = await db.user.create({
              data: {
                email: profile.email || "",
                name: profile.name || "Unnamed User",
                image: profile.picture || "",
                accounts: {
                  create: {
                    provider: "google",
                    providerAccountId: profile.sub || "",
                    access_token: profile.accessToken || "",
                    refresh_token: profile.refreshToken || "",
                    token_type: "bearer",
                    expires_at: profile.exp,
                    type: "oauth",
                  },
                },
              },
            });
            return user;
          }
          return existingUser;
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
