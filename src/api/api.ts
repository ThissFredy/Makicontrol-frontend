import { ApiResponse } from "@/types/apiType";
import { getTokenCookie } from "@/utilities/loginUtility"; // Importamos la función para obtener la cookie

// Obtén la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

    console.log("Llamando a la API:", url, "con opciones:", options);

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
            credentials: "include",
        });

        const data = await response.json();

        console.log("Respuesta de la API:", data);

        if (response.status < 200 || response.status >= 300) {
            const error = data.errors[0] || "Error en la petición";
            return {
                success: false,
                message: data.message ? data.message : error,
                error: data.message || "Unknown error",
            };
        }

        return {
            success: true,
            message: data.message || "Operación exitosa",
            data: data as T,
            error: "",
        };
    } catch (error) {
        console.error(error);
        const errorMessage = "Error de red o servidor";
        return {
            success: false,
            message: errorMessage,
            error: "NetworkError",
        };
    }
}
