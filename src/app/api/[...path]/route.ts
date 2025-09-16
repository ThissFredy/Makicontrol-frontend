import { NextRequest, NextResponse } from "next/server";

// URL de tu backend real
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(request: NextRequest) {
    // Obtener el token de la cookie. La lógica es la misma para todos los métodos.
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "Not authorized" },
            { status: 401 }
        );
    }

    // Construir la URL completa del backend, incluyendo los parámetros de búsqueda.
    const path = request.nextUrl.pathname.replace("/api", "");
    const searchParams = request.nextUrl.search;
    const backendUrl = `${API_BASE_URL}${path}${searchParams}`;

    // Preparar los encabezados para el backend.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    // Manejar el body solo si es necesario (POST, PUT, etc.).
    // Esto evita errores en peticiones GET o DELETE sin cuerpo.

    const response = await fetch(backendUrl, {
        method: request.method,
        headers: requestHeaders,
        body: request.body,
    });

    if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
