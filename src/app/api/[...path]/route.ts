import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(request: NextRequest) {
    // 1. Obtener token de la cookie
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Construir la URL del backend real
    // La ruta se obtiene del request, eliminando el prefijo /api
    const path = request.nextUrl.pathname.replace("/api", "");
    const searchParams = request.nextUrl.search;
    const backendUrl = `${API_BASE_URL}${path}${searchParams}`;

    // 3. Preparar los headers para la petición al backend
    // Copiamos los headers originales del cliente para mantenerlos (ej. Content-Type)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    // Borramos el host para evitar problemas de enrutamiento
    requestHeaders.delete("host");

    try {
        // 4. Realizar la petición al backend, pasando el cuerpo como un stream
        const response = await fetch(backendUrl, {
            method: request.method,
            headers: requestHeaders,
            body: request.body, // Se pasa el stream directamente. ¡No usar .text() ni .json()!
            // @ts-ignore - 'duplex' es necesario para streams en algunas versiones de Node/Next.js
            duplex: "half",
        });

        // 5. Devolver la respuesta del backend al cliente
        // Esto maneja tanto respuestas JSON como blobs de archivos
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error("Error en el proxy de Next.js:", error);
        return NextResponse.json(
            { message: "Error al conectar con el servidor backend" },
            { status: 500 }
        );
    }
}

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as DELETE,
    handler as PATCH,
};
