import { LoginCredentials, LoginResponse } from "@/types/loginType";
import { apiService } from "@/api/api"; 
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
            return {
                success: false,
                message: data.message || "Credenciales incorrectas",
                error: data.errors || "Error de autenticación",
            };
        }
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

/**
 * Llama al endpoint de logout a través del proxy de Next.js.
 * Esto asegura que la cookie HttpOnly sea eliminada por el servidor.
 * @return {Promise<ApiResponse<unknown>>} La respuesta de la API.
 */
export async function logoutApi(): Promise<ApiResponse<unknown>> {
    const url = `/auth/logout`;
    try {
        const response = await apiService(url, {
            method: "POST",
        });
        
        if (!response.success) {
            return {
                success: false,
                message: "Error durante el logout",
                data: null,
                error: "LogoutError",
            };
        }

        return {
            success: true,
            message: "Logout successful",
            data: null,
            error: "",
        }
    } catch (error) {
        console.error("Error en logoutApi:", error);
        return {
            success: false,
            message: "Error durante el logout",
            error: "LogoutError",
        };
    }
}
