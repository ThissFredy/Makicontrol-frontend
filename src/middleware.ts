import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("auth-token")?.value;

    const publicRoutes = ["/login"];

    const protectedRoutes = [
        "/",
        "/register",
        "/dashboard",
        "/products",
        "/sales",
        "/customers",
        "/settings",
    ];

    const specialRoutes = ["/error"];

    const validRoutes = [...publicRoutes, ...protectedRoutes, ...specialRoutes];

    if (pathname === "/") {
        if (authToken) {
            return NextResponse.redirect(new URL("/customers", request.url));
        } else {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 2. Verificar si la ruta existe, si no redirigir a /error
    if (!validRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/error", request.url));
    }

    // 3. Si está logueado y trata de acceder a login, redirigir a customers
    if (authToken && pathname === "/login") {
        return NextResponse.redirect(new URL("/customers", request.url));
    }

    // 4. Si NO está logueado y trata de acceder a rutas protegidas, redirigir a login
    if (!authToken && protectedRoutes.includes(pathname)) {
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
