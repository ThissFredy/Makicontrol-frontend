import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("auth-token")?.value;

    const publicRoutes = ["/login", "/register"];

    // Redirect to dashboard if logged
    if (publicRoutes.includes(pathname) && authToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect to login if not logged
    if (!publicRoutes.includes(pathname) && !authToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/products",
        "/sales",
        "/customers",
        "/settings",
    ],
};
