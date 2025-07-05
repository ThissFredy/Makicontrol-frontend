import type { LoginCredentials } from "@/types/loginType";
import type { ErrorFieldType } from "@/types/errorType";

export const validateLogin = (data: LoginCredentials) => {
    const errors: ErrorFieldType[] = [];

    if (!data.email) {
        errors.push({
            isError: true,
            field: {
                name: "email",
                value: "Este campo es obligatorio",
            },
        });
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.push({
            isError: true,
            field: {
                name: "email",
                value: "El formato del correo electrónico es inválido",
            },
        });
    }

    if (!data.password) {
        errors.push({
            isError: true,
            field: {
                name: "password",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.password.length < 6) {
        errors.push({
            isError: true,
            field: {
                name: "password",
                value: "La contraseña debe tener al menos 6 caracteres",
            },
        });
    } else if (data.password.length > 25) {
        errors.push({
            isError: true,
            field: {
                name: "password",
                value: "La contraseña no puede tener más de 25 caracteres",
            },
        });
    }
    return errors;
};
