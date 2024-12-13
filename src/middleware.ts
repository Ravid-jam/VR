import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken");

  const publicPaths = ["/signin"];
  const privatePaths = ["/"];

  // if (privatePaths.includes(req.nextUrl.pathname) && refreshToken) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  const isProtectedPage = !publicPaths.includes(req.nextUrl.pathname);

  if ((isProtectedPage || req.nextUrl.pathname === "/") && !refreshToken) {
    const res = NextResponse.redirect(new URL("/signin", req.url));
    resetCookies(res);
    return res;
  } else if (!isProtectedPage && refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

function resetCookies(response: NextResponse) {
  response.cookies.set("refreshToken", "", { maxAge: -1 });
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*|favicon.ico).*)"],
};
