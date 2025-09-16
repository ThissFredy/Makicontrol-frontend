import { ApiResponse } from "@/types/apiType";
import { logoutApi } from "@/api/loginApi";

/**
 * Realiza una petición a la API de forma genérica y tipada.
 * @param endpoint El endpoint al que se llamará (ej. '/users').
 * @param options Opciones de la petición fetch (method, body, headers, etc.).
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos o un error.
 */
// en tu archivo de servicios de api

export async function apiService<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const url = `/api${endpoint}`; // Llamamos a nuestro proxy

    const isFormData = options?.body instanceof FormData;

    // Clonamos los headers para poder modificarlos
    const headers = new Headers(options?.headers);

    if (isFormData) {
        // SI ES FORMDATA, BORRAMOS EL CONTENT-TYPE.
        // El navegador lo pondrá automáticamente con el boundary correcto.
        headers.delete("Content-Type");
    } else if (!headers.has("Content-Type")) {
        // Si no es FormData y no hay Content-Type, asumimos que es JSON.
        headers.set("Content-Type", "application/json");
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: headers, // Usamos los headers modificados
            credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
            // ... tu lógica de logout ...
            return new Promise(() => {});
        }

        const data = await response.json();

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
            message: "Error de red o servidor",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
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
