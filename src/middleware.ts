import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (path.startsWith("/admin")) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (
    path.startsWith("/me") ||
    path.startsWith("/books/new") ||
    path.startsWith("/messages")
  ) {
    if (!isLoggedIn) {
      const signIn = new URL("/login", req.url);
      signIn.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(signIn);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/me/:path*", "/books/new", "/messages/:path*"],
};
