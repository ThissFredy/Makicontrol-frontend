import { LoginCredentials, LoginResponse } from "@/types/loginType";
import { apiService } from "./api";
import { ApiResponse } from "@/types/apiType";

/**
 * Llama al endpoint de login de la API y guarda el token en una cookie si es exitoso.
 * @param credentials Las credenciales del usuario (email y password).
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos del login.
 */
export async function loginApi(
    credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService<LoginResponse>("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });

    return response;
}
