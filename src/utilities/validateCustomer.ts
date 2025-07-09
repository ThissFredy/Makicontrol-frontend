import type { CustomerCreateType } from "@/types/customerType";
import type { ErrorFieldType } from "@/types/errorType";

export function validateCreate(data: CustomerCreateType): ErrorFieldType[] {
    const errors: ErrorFieldType[] = [];

    if (!data.nombre) {
        errors.push({
            isError: true,
            field: {
                name: "nombre",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.nombre.length < 3) {
        errors.push({
            isError: true,
            field: {
                name: "nombre",
                value: "El nombre debe tener al menos 3 caracteres",
            },
        });
    } else if (data.nombre.length > 80) {
        errors.push({
            isError: true,
            field: {
                name: "nombre",
                value: "El nombre no puede tener más de 80 caracteres",
            },
        });
    }

    // TODO: Validar largo con la base de datos
    if (!data.nit) {
        errors.push({
            isError: true,
            field: {
                name: "nit",
                value: "Este campo es obligatorio",
            },
        });
    } else if (/[^0-9]/.test(data.nit.toString())) {
        errors.push({
            isError: true,
            field: {
                name: "nit",
                value: "El NIT no puede contener letras o caracteres especiales",
            },
        });
    } else if (data.nit <= 0) {
        errors.push({
            isError: true,
            field: {
                name: "nit",
                value: "El NIT debe ser un número positivo",
            },
        });
    } else if (data.nit.toString().length < 4) {
        errors.push({
            isError: true,
            field: {
                name: "nit",
                value: "El NIT debe tener al menos 4 dígitos",
            },
        });
    } else if (data.nit.toString().length > 35) {
        errors.push({
            isError: true,
            field: {
                name: "nit",
                value: "El NIT no puede tener más de 35 dígitos",
            },
        });
    }

    if (!data.direccion) {
        errors.push({
            isError: true,
            field: {
                name: "direccion",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.direccion.length < 5) {
        errors.push({
            isError: true,
            field: {
                name: "direccion",
                value: "La dirección debe tener al menos 5 caracteres",
            },
        });
    } else if (data.direccion.length > 250) {
        errors.push({
            isError: true,
            field: {
                name: "direccion",
                value: "La dirección no puede tener más de 250 caracteres",
            },
        });
    }

    if (!data.telefono) {
        errors.push({
            isError: true,
            field: {
                name: "telefono",
                value: "Este campo es obligatorio",
            },
        });
        // Phone can be (322) 45678913 or 32245678913
    } else {
        // Limpiar el teléfono de caracteres especiales para validar solo números
        const cleanPhone = data.telefono.replace(/[\s\-\(\)\.]/g, "");

        // Validar que contenga solo números después de limpiar
        if (!/^\d+$/.test(cleanPhone)) {
            errors.push({
                isError: true,
                field: {
                    name: "telefono",
                    value: "El teléfono solo puede contener números, espacios, guiones y paréntesis",
                },
            });
        } else if (cleanPhone.length < 7) {
            errors.push({
                isError: true,
                field: {
                    name: "telefono",
                    value: "El teléfono debe tener al menos 7 dígitos",
                },
            });
        } else if (cleanPhone.length > 15) {
            errors.push({
                isError: true,
                field: {
                    name: "telefono",
                    value: "El teléfono no puede tener más de 15 dígitos",
                },
            });
        }
    }

    if (!data.correo) {
        errors.push({
            isError: true,
            field: {
                name: "correo",
                value: "Este campo es obligatorio",
            },
        });
    } else if (!/\S+@\S+\.\S+/.test(data.correo)) {
        errors.push({
            isError: true,
            field: {
                name: "correo",
                value: "El correo electrónico no es válido",
            },
        });
    } else if (/\s/.test(data.correo)) {
        errors.push({
            isError: true,
            field: {
                name: "correo",
                value: "El correo electrónico no puede contener espacios",
            },
        });
    } else if (data.correo.length > 90) {
        errors.push({
            isError: true,
            field: {
                name: "correo",
                value: "El correo electrónico no puede tener más de 90 caracteres",
            },
        });
    }

    return errors;
}
