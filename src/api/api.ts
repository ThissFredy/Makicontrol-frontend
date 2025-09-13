import { ApiResponse } from "@/types/apiType";
import { logoutApi } from "@/api/loginApi"; // Importamos la nueva función de logout

const API_BASE_URL = "/api";

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

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
    };

    console.log("Llamando a la API (proxy):", url, "con opciones:", options);

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
            credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
            console.log(
                "Error de autenticación detectado (401/403). Deslogueando..."
            );
            await logoutApi();
            window.location.href = "/login";
            return new Promise(() => {});
        }
        const data = await response.json();

        console.log("Respuesta de la API:", data);

        if (response.status < 200 || response.status >= 300) {
            const error = data.errors[0] || "Error en la petición";
            return {
                success: false,
                message: data.message ? data.message : error,
                error: data.errors || "Unknown error",
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

// La función apiServiceFile ahora es idéntica a apiService, se podría unificar
// pero la mantenemos por si en el futuro tiene lógica específica para archivos.
export async function apiServiceFile<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    return apiService<T>(endpoint, options);
}

/**
 * Servicio de API especializado para descargar archivos.
 */
export async function downloadApi(
    endpoint: string,
    options?: RequestInit
): Promise<Response> {
    const url = `/api${endpoint}`; // Asumiendo que llamas a tu proxy de Next.js

    const defaultHeaders: Record<string, string> = {
        ...(options?.headers as Record<string, string>),
    };

    console.log(
        "Llamando a la API de descarga (proxy):",
        url,
        "con opciones:",
        options
    );

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
            credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
            console.log(
                "Error de autenticación detectado (401/403). Deslogueando..."
            );
            await logoutApi();
            window.location.href = "/login";
            return new Promise(() => {});
        }

        return response;
    } catch (error) {
        console.error("Error de red en apiDownloadService:", error);
        // En caso de un error de red, lanzamos la excepción para que el servicio la maneje.
        throw new Error("Error de red o servidor al intentar la descarga.");
    }
}
