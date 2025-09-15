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
    const headers = new Headers({
        Authorization: `Bearer ${token}`,
    });

    // Manejar el body solo si es necesario (POST, PUT, etc.).
    // Esto evita errores en peticiones GET o DELETE sin cuerpo.
    let body: BodyInit | null = null;

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
        try {
            const response = await fetch(backendUrl, {
                method: request.method,
                headers,
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ message: "Error en el backend" }));
                return NextResponse.json(errorData, {
                    status: response.status,
                });
            }

            const blob = await response.blob();

            const responseToClient = new NextResponse(blob, {
                status: response.status,
                statusText: response.statusText,
            });

            responseToClient.headers.set(
                "Content-Type",
                response.headers.get("Content-Type") ||
                    "application/octet-stream"
            );
            responseToClient.headers.set(
                "Content-Disposition",
                response.headers.get("Content-Disposition") || "attachment"
            );

            const estadoFactura = response.headers.get("X-Estado-Factura");
            if (estadoFactura) {
                responseToClient.headers.set("X-Estado-Factura", estadoFactura);
            }

            return responseToClient;
        } catch (error) {
            console.error("[NEXTJS] Invalid JSON body", error);
            return NextResponse.json(
                { message: "[NEXTJS] Invalid JSON body" },
                { status: 400 }
            );
        }
    }

    console.log("Proxy: Manejando petición JSON a:", backendUrl);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
        body = await request.text();
    }

    const response = await fetch(backendUrl, {
        method: request.method,
        headers: requestHeaders,
        body,
        // @ts-ignore
        duplex: "half",
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

