import Cookies from "js-cookie";
import type { LoginResponse } from "@/types/loginType";
import type { OperationType } from "@/types/operationType";
import type { UserToken } from "@/types/userType";
import { useAuthStore } from "@/store/authStore";

const TOKEN_KEY = "auth-token";

export const setTokenCookie = (
    data: LoginResponse
): OperationType<UserToken | null> => {
    if (data.token) {
        Cookies.set(TOKEN_KEY, data.token, {
            expires: 3,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        useAuthStore.getState().setToken(data.token);

        console.log("Token guardado:", useAuthStore.getState().token);
        return {
            status: true,
            message: "Token guardado correctamente",
            data: null,
        } as OperationType<null>;
    } else {
        return {
            status: false,
            message:
                "No token was provided, please check your credentials",
            data: null,
        } as OperationType<null>;
    }
};

export const getTokenCookie = (): string => {
    return Cookies.get(TOKEN_KEY) || "";
};

export const removeTokenCookie = () => {
    Cookies.remove(TOKEN_KEY);
};
