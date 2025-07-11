import type { ContractCreateType } from "@/types/contractType";
import type { ErrorFieldType } from "@/types/errorType";


export function validateCreate(data: ContractCreateType): ErrorFieldType[] {
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
    } else if (data.clienteNit <= 0) {
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

    if (!data.tipoContrato) {
        errors.push({
            isError: true,
            field: {
                name: "tipoContrato",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (data.valorCanon < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede ser negativo",
            },
        });
    } else if (data.valorCanon === undefined || data.valorCanon === null) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.valorCanon.toString().length > 11) {
        if (data.valorBaseEquipo < 0) {
            errors.push({
                isError: true,
                field: {
                    name: "valorCanon",
                    value: "El valor del canon no puede tener más de 11 dígitos",
                },
            });
        }
    }

    if (data.valorBaseEquipo < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede ser negativo",
            },
        });
    } else if (
        data.valorBaseEquipo === undefined ||
        data.valorBaseEquipo === null
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.valorBaseEquipo.toString().length > 11) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede tener más de 11 dígitos",
            },
        });
    }

    if (!data.periodo) {
        errors.push({
            isError: true,
            field: {
                name: "periodo",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.periodo.toString().length > 10) {
        errors.push({
            isError: true,
            field: {
                name: "periodo",
                value: "El periodo no puede tener más de 10 caracteres",
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

    if (!data.fechaFin) {
    } else if (data.fechaFin.toString().length > 10) {
        errors.push({
            isError: true,
            field: {
                name: "fechaFin",
                value: "La fecha de fin no puede tener más de 10 caracteres",
            },
        });
    }

    // Si la fecha de fin es anterior a la fecha de inicio
    if (data.fechaFin && data.fechaInicio) {
        const startDate = new Date(data.fechaInicio);
        const endDate = new Date(data.fechaFin);
        if (endDate < startDate) {
            errors.push({
                isError: true,
                field: {
                    name: "fechaFin",
                    value: "La fecha de fin no puede ser anterior a la fecha de inicio",
                },
            });
        }
    }

    if (!data.estado) {
        errors.push({
            isError: true,
            field: {
                name: "estado",
                value: "Este campo es obligatorio",
            },
        });
    }

    return errors;
}
