import type { printerCreateType } from "@/types/printerType";
import type { ErrorFieldType } from "@/types/errorType";
import { getCustomerByNIT } from "@/api/customerApi";

export async function validateCreate(
    data: printerCreateType
): Promise<ErrorFieldType[]> {
    const errors: ErrorFieldType[] = [];

    if (/[^0-9]/.test(data.clienteNit.toString())) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente no puede contener letras o caracteres especiales",
            },
        });
    } else if (!data.clienteNit) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "Este campo es obligatorio",
            },
        });
    } else if (Number(data.clienteNit) <= 0) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente debe ser un número positivo",
            },
        });
    } else if (data.clienteNit.toString().length < 4) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente debe tener al menos 4 dígitos",
            },
        });
    } else if (data.clienteNit.toString().length > 35) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente no puede tener más de 35 dígitos",
            },
        });
    }

    if (!data.serial) {
        errors.push({
            isError: true,
            field: {
                name: "serial",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.serial.toString().length > 50) {
        errors.push({
            isError: true,
            field: {
                name: "serial",
                value: "El serial no puede tener más de 50 caracteres",
            },
        });
    }

    if (!data.modelo) {
        errors.push({
            isError: true,
            field: {
                name: "modelo",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.modelo.toString().length > 50) {
        errors.push({
            isError: true,
            field: {
                name: "modelo",
                value: "El modelo no puede tener más de 50 caracteres",
            },
        });
    }

    if (!data.fechaInicio) {
        errors.push({
            isError: true,
            field: {
                name: "fechaInicio",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.fechaInicio.toString().length > 10) {
        errors.push({
            isError: true,
            field: {
                name: "fechaInicio",
                value: "La fecha de inicio no puede tener más de 10 caracteres",
            },
        });
    }

    return errors;
}

export async function validateEdit(
    data: printerCreateType
): Promise<ErrorFieldType[]> {
    const errors: ErrorFieldType[] = [];
    const customer = await getCustomerByNIT(data.clienteNit);

    if (/[^0-9]/.test(data.clienteNit.toString())) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente no puede contener letras o caracteres especiales",
            },
        });
    } else if (!data.clienteNit) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "Este campo es obligatorio",
            },
        });
    } else if (Number(data.clienteNit) <= 0) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente debe ser un número positivo",
            },
        });
    } else if (data.clienteNit.toString().length < 4) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente debe tener al menos 4 dígitos",
            },
        });
    } else if (data.clienteNit.toString().length > 35) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente no puede tener más de 35 dígitos",
            },
        });
    } else if (!customer.success) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "El NIT del cliente no existe",
            },
        });
    }

    if (!data.serial) {
        errors.push({
            isError: true,
            field: {
                name: "serial",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.serial.toString().length > 50) {
        errors.push({
            isError: true,
            field: {
                name: "serial",
                value: "El serial no puede tener más de 50 caracteres",
            },
        });
    }

    if (!data.modelo) {
        errors.push({
            isError: true,
            field: {
                name: "modelo",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.modelo.toString().length > 50) {
        errors.push({
            isError: true,
            field: {
                name: "modelo",
                value: "El modelo no puede tener más de 50 caracteres",
            },
        });
    }

    if (!data.fechaInicio) {
        errors.push({
            isError: true,
            field: {
                name: "fechaInicio",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.fechaInicio.toString().length > 10) {
        errors.push({
            isError: true,
            field: {
                name: "fechaInicio",
                value: "La fecha de inicio no puede tener más de 10 caracteres",
            },
        });
    }

    return errors;
}
