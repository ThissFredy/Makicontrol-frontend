import { ApiResponse } from "@/types/apiType";
import { getTokenCookie } from "@/utilities/loginUtility"; // Importamos la función para obtener la cookie

// Obtén la URL base de la API desde las variables de entorno
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://9.169.164.229:8081/auth";

/**
 * Realiza una petición a la API de forma genérica y tipada.
 * @param endpoint El endpoint al que se llamará (ej. '/users').
 * @param options Opciones de la petición fetch (method, body, headers, etc.).
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos o un error.
 */
export async function apiService<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getTokenCookie();

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
    };

    // Si existe un token, lo añadimos a la cabecera de autorización
    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
    console.log("URL de la API:", url);
    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message ||
                    `Error ${response.status}: ${response.statusText}`,
                error: data.error || "Unknown error",
            };
        }

        return {
            success: true,
            message: data.message || "Operación exitosa",
            data: data.data as T,
            error: "",
        };
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Error de red o de conexión";
        return {
            success: false,
            message: errorMessage,
            error: "NetworkError",
        };
    }
}
