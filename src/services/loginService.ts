import { LoginCredentials } from "@/types/loginType";
import { UserToken } from "@/types/userType";
import { LoginResponse } from "@/types/loginType";
import { loginApi } from "@/api/loginApi";
import { setTokenCookie } from "@/utilities/loginUtility";
import { OperationType } from "@/types/operationType";

export async function loginService(
    credentials: LoginCredentials
): Promise<OperationType<UserToken | null>> {
    try {
        const response = await loginApi(credentials);
        const data = response.data as LoginResponse;

        if (response.success && data) {
            const userResponse = setTokenCookie(data);
            return {
                status: true,
                message: "Inicio de sesión exitoso",
                data: userResponse.data,
            } as OperationType<UserToken>;
        }

        return {
            status: false,
            message: response.message || "Error al iniciar sesión",
            data: null,
        } as OperationType<null>;
    } catch (error) {
        console.error("Error en loginService:", error);
        return {
            status: false,
            message: "Error al iniciar sesión",
            data: null,
        } as OperationType<null>;
    }
}
