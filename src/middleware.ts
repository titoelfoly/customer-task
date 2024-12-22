import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth.config";
import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  const isAuth = req.auth;

  if (
    pathname.startsWith("/api/customers") ||
    pathname.startsWith("/api/mailer")
  ) {
    console.log(pathname, "pathname");
    return NextResponse.next();
  }

  const isAccessingApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isAccessingAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isAccessingApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAccessingAuthRoute) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (!isAuth && isAccessingProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  skipRoutes: ["/api/customers", "/api/mailer"],
};
