import { ApiResponse } from "@/types/apiType";
import { logoutApi } from "@/api/loginApi";

// El /api inicial apunta a tu proxy de Next.js
const API_PROXY_PREFIX = "/api";

/**
 * Realiza una petición a la API de forma genérica y tipada.
 * Maneja tanto peticiones JSON como FormData automáticamente.
 * @param endpoint El endpoint al que se llamará (ej. '/users').
 * @param options Opciones de la petición fetch (method, body, headers, etc.).
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos o un error.
 */
export async function apiService<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_PROXY_PREFIX}${endpoint}`;

    // Determina si el cuerpo es FormData
    const isFormData = options.body instanceof FormData;

    // Clona los headers para poder modificarlos de forma segura
    const headers = new Headers(options.headers);

    if (isFormData) {
        // Si es FormData, BORRAMOS el Content-Type.
        // El navegador lo establecerá automáticamente con el 'boundary' correcto.
        headers.delete("Content-Type");
    } else if (!headers.has("Content-Type")) {
        // Si no es FormData y no se ha especificado un Content-Type, asumimos JSON.
        headers.set("Content-Type", "application/json");
    }

    console.log("Llamando a la API (proxy):", url, "con opciones:", {
        ...options,
        headers: Object.fromEntries(headers),
    });

    try {
        const response = await fetch(url, {
            ...options,
            headers, // Usamos los headers modificados
            credentials: "include", // Importante para enviar cookies al proxy
        });

        console.log("Respuesta del proxy:", response);

        // Manejo de errores de autenticación
        if (response.status === 401 || response.status === 403) {
            console.log("Error de autenticación (401/403). Deslogueando...");
            await logoutApi();
            window.location.href = "/login";
            // Retornamos una promesa que nunca se resuelve para detener la ejecución
            return new Promise(() => {});
        }

        // Si la respuesta no tiene contenido (ej. DELETE exitoso), retornamos éxito
        if (response.status === 204) {
            return {
                success: true,
                message: "Operación exitosa",
                data: null as T,
                error: "",
            };
        }

        const data = await response.json();
        console.log("Datos de la API:", data);

        if (!response.ok) {
            const error = data.errors?.[0] || "Error en la petición";
            return {
                success: false,
                message: data.message || error,
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
        console.error("Error de red en apiService:", error);
        return {
            success: false,
            message: "Error de red o el servidor no está disponible",
            error: "NetworkError",
        };
    }
}

/**
 * Servicio de API especializado para descargar archivos.
 * @param endpoint El endpoint de descarga.
 * @param options Opciones de la petición.
 * @returns La respuesta `Response` cruda para manejar el blob.
 */
export async function downloadApiService(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = `${API_PROXY_PREFIX}${endpoint}`;

    console.log(
        "Llamando a la API de descarga (proxy):",
        url,
        "con opciones:",
        options
    );

    try {
        const response = await fetch(url, {
            ...options,
            credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
            console.log("Error de autenticación (401/403). Deslogueando...");
            await logoutApi();
            window.location.href = "/login";
            // Esto detendrá la ejecución del código que llamó a esta función
            throw new Error("No autorizado");
        }

        return response;
    } catch (error) {
        console.error("Error de red en downloadApiService:", error);
        throw new Error("Error de red o servidor al intentar la descarga.");
    }
}
