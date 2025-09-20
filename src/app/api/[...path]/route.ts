import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestInitWithDuplex = RequestInit & {
    duplex?: "half" | "full" | "auto";
};

async function handler(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const path = request.nextUrl.pathname.replace("/api", "");
    const backendUrl = `${API_BASE_URL}${path}${request.nextUrl.search}`;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    requestHeaders.delete("host");

    const fetchOptions: RequestInitWithDuplex = {
        method: request.method,
        headers: requestHeaders,
    };

    // Only set the body for methods that typically have one
    if (request.method !== "GET" && request.method !== "HEAD") {
        fetchOptions.body = request.body;
        fetchOptions.duplex = "half" as const;
    }

    try {
        console.log(`[PROXY] Forwarding ${request.method} to ${backendUrl}`);

        const response = await fetch(backendUrl, fetchOptions);

        console.log(
            `[PROXY] Backend responded with status: ${response.status}`
        );

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error("[PROXY] CRITICAL ERROR:", error);
        return NextResponse.json(
            {
                message:
                    "Error interno en el servidor de Next.js al procesar la petición.",
            },
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
