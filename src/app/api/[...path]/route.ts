// app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Función genérica para manejar todas las peticiones al proxy.
 */
async function handler(request: NextRequest) {
    // Obtener el token de la cookie. La lógica es la misma para todos los métodos.
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "Not authorized" },
            { status: 401 }
        );
    }

    // 2. Construir la URL completa del backend, incluyendo los parámetros de búsqueda.
    const path = request.nextUrl.pathname.replace("/api", "");
    const backendUrl = `${API_BASE_URL}${path}`;

    // Preparar los encabezados para el backend.
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Manejar el body solo si es necesario (POST, PUT, etc.).
    // Esto evita errores en peticiones GET o DELETE sin cuerpo.
    let body: BodyInit | null = null;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
        try {
            // Pasamos el cuerpo de la petición original al backend.
            body = JSON.stringify(await request.json());
        } catch (error) {
            console.error("[NEXTJS] Invalid JSON body", error);
            return NextResponse.json(
                { message: "[NEXTJS] Invalid JSON body" },
                { status: 400 },
            );
        }
    }

    // 5. Realizar la llamada al backend real.
    const response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body,
        // @ts-ignore
        duplex: "half",
    });

    // 6. Devolver la respuesta del backend al cliente.
    // Maneja el caso de que la respuesta no tenga contenido (ej. status 204).
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
