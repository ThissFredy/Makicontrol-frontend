import { LoginCredentials, LoginResponse } from "@/types/loginType";
// Ya no necesitamos el apiService genérico aquí
// import { apiService } from "@/api/api"; 
import { ApiResponse } from "@/types/apiType";

// Obtenemos la URL real del backend, la misma que usa tu proxy
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Llama DIRECTAMENTE al endpoint de login del backend.
 * Esta función es la EXCEPCIÓN y no pasa por el proxy de Next.js.
 * @param credentials Las credenciales del usuario (email y password).
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos del login.
 */
export async function loginApi(
    credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> {
    const url = `${API_BASE_URL}/auth/login`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            // Si el backend devuelve un error (ej. 401, 400), lo manejamos
            return {
                success: false,
                message: data.message || "Credenciales incorrectas",
                error: data.errors || "Error de autenticación",
            };
        }
        
        // Si el login es exitoso, el navegador ya habrá procesado
        // el encabezado 'Set-Cookie' del backend.
        return {
            success: true,
            message: "Login exitoso",
            data: data as LoginResponse,
            error: "",
        };

    } catch (error) {
        console.error("Error de red en loginApi:", error);
        return {
            success: false,
            message: "Error de red o no se pudo conectar al servidor.",
            error: "NetworkError",
        };
    }
}