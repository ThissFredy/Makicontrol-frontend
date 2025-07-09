import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";

// * Se ejecutara antes de cada request

export function middleware(request: NextRequest) {
    // public routes
    const publicRoutes = ["/login", "/register"];

    // Cookie
    const authToken = request.cookies.get("authToken");

    // Path
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard") && !authToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}
