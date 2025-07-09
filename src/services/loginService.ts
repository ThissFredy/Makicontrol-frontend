import { LoginCredentials } from "@/types/loginType";
import { LoginResponse } from "@/types/loginType";
import { loginApi } from "@/api/loginApi";
import { setTokenCookie } from "@/utilities/loginUtility";
import { OperationType } from "@/types/operationType";

export async function loginService(
    credentials: LoginCredentials
): Promise<OperationType<LoginResponse>> {
    try {
        const response = await loginApi(credentials);
        const data = response.data as LoginResponse;

        if (response.success && data) {
            setTokenCookie(data);
            return {
                status: true,
                message: "Inicio de sesión exitoso",
                data: { token: "" },
            } as OperationType<LoginResponse>;
        }

        return {
            status: false,
            message: response.message || "Error al iniciar sesión",
            data: { token: "" },
        } as OperationType<LoginResponse>;
    } catch (error) {
        console.error("Error en el servicio de login:", error);
        return {
            status: false,
            message: "Error al iniciar sesión",
            data: { token: "" },
        } as OperationType<LoginResponse>;
    }
}
