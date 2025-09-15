import { LoginCredentials } from "@/types/loginType";
import { UserToken } from "@/types/userType";
import { LoginResponse } from "@/types/loginType";
import { loginApi, logoutApi } from "@/api/loginApi";
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

export async function logoutService(): Promise<OperationType<null>> {
    try {
        const response = await logoutApi();
        if (response.success) {
            return {
                status: true,
                message: "Logout successful",
                data: null,
            } as OperationType<null>;
        }

        return {
            status: false,
            message: response.message || "Error during logout",
            data: null,
        } as OperationType<null>;
    } catch (error) {
        console.error("Error en logoutService:", error);
        return {
            status: false,
            message: "Error during logout",
            data: null,
        } as OperationType<null>;
    }
}