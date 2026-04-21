import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "邮箱或学号", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const rawId = credentials?.identifier;
        const password = credentials?.password;
        if (typeof rawId !== "string" || typeof password !== "string") return null;

        const id = rawId.trim();
        if (!id) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: id }, { studentId: id }],
          },
        });
        if (!user) return null;
        if (user.banned) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? user.studentId ?? "",
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
        token.name = user.name;
      }
      if (trigger === "update" && session && typeof session === "object") {
        const s = session as { name?: string | null };
        if (typeof s.name === "string") token.name = s.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? UserRole.USER;
        if (token.name !== undefined) session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
