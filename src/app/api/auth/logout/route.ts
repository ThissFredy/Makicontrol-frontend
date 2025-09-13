import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Maneja la petición de logout.
 * Su única función es invalidar la cookie de autenticación.
 * @returns {NextResponse} La respuesta de la API.
 *
 */
export async function POST() {
    const cookieStore = await cookies();

    // Invalidamos la cookie 'auth-token' estableciendo su edad máxima a 0
    cookieStore.set("auth-token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
