import type { ContractCreateType } from "@/types/contractType";
import type { ErrorFieldType } from "@/types/errorType";
import type {
    ContractDetailType,
    CreateContractDetailType,
} from "@/types/contractType";
import { getCustomerByNIT } from "@/api/customerApi";

export async function validateCreate(
    data: ContractCreateType
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

    if (!data.tipoContrato) {
        errors.push({
            isError: true,
            field: {
                name: "tipoContrato",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (
        data.valorCanon.toString().includes(",") ||
        data.valorCanon.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (isNaN(Number(data.valorCanon))) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon debe ser un número",
            },
        });
    } else if (Number(data.valorCanon) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede ser negativo",
            },
        });
    } else if (data.valorCanon.toString().length > 11) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede tener más de 11 dígitos",
            },
        });
    }

    if (
        data.valorBaseEquipo.toString().includes(",") ||
        data.valorBaseEquipo.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (isNaN(Number(data.valorBaseEquipo))) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo debe ser un número",
            },
        });
    } else if (Number(data.valorBaseEquipo) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede ser negativo",
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

export async function validateEdit(
    data: ContractCreateType
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

    if (!data.tipoContrato) {
        errors.push({
            isError: true,
            field: {
                name: "tipoContrato",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (
        data.valorCanon.toString().includes(",") ||
        data.valorCanon.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (isNaN(Number(data.valorCanon))) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon debe ser un número",
            },
        });
    } else if (Number(data.valorCanon) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede ser negativo",
            },
        });
    } else if (data.valorCanon.toString().length > 11) {
        errors.push({
            isError: true,
            field: {
                name: "valorCanon",
                value: "El valor del canon no puede tener más de 11 dígitos",
            },
        });
    }

    if (
        data.valorBaseEquipo.toString().includes(",") ||
        data.valorBaseEquipo.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (isNaN(Number(data.valorBaseEquipo))) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo debe ser un número",
            },
        });
    } else if (Number(data.valorBaseEquipo) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBaseEquipo",
                value: "El valor base del equipo no puede ser negativo",
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

export async function validateDetailsContract(data: ContractDetailType) {
    const errors: ErrorFieldType[] = [];

    if (!data.clienteNit) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (!data.tipoOperacion) {
        errors.push({
            isError: true,
            field: {
                name: "tipoOperacion",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (
        data.limiteIncluido.toString().includes(",") ||
        data.limiteIncluido.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El valor del límite incluido no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.limiteIncluido == 0) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.limiteIncluido))) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El límite incluido debe ser un número",
            },
        });
    }
    if (Number(data.limiteIncluido) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El límite incluido no puede ser negativo",
            },
        });
    }

    if (
        data.valorUnitario.toString().includes(",") ||
        data.valorUnitario.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.valorUnitario == 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.valorUnitario))) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario debe ser un número",
            },
        });
    }
    if (Number(data.valorUnitario) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario no puede ser negativo",
            },
        });
    }

    if (
        data.valorBase.toString().includes(",") ||
        data.valorBase.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.valorBase == 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.valorBase))) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base debe ser un número",
            },
        });
    }
    if (Number(data.valorBase) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base no puede ser negativo",
            },
        });
    }

    if (!data.modoCobro) {
        errors.push({
            isError: true,
            field: {
                name: "modoCobro",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.modoCobro.toString().length > 25) {
        errors.push({
            isError: true,
            field: {
                name: "modoCobro",
                value: "El modo de cobro no puede tener más de 25 caracteres",
            },
        });
    }

    return errors;
}

export async function validateCreateDetailsContract(
    data: CreateContractDetailType
) {
    const errors: ErrorFieldType[] = [];

    if (!data.clienteNit) {
        errors.push({
            isError: true,
            field: {
                name: "clienteNit",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (!data.tipoOperacion) {
        errors.push({
            isError: true,
            field: {
                name: "tipoOperacion",
                value: "Este campo es obligatorio",
            },
        });
    }

    if (
        data.limiteIncluido.toString().includes(",") ||
        data.limiteIncluido.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El límite incluido no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.limiteIncluido == 0) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.limiteIncluido))) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El límite incluido debe ser un número",
            },
        });
    }
    if (Number(data.limiteIncluido) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "limiteIncluido",
                value: "El límite incluido no puede ser negativo",
            },
        });
    }

    if (
        data.valorUnitario.toString().includes(",") ||
        data.valorUnitario.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.valorUnitario == 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.valorUnitario))) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario debe ser un número",
            },
        });
    }
    if (Number(data.valorUnitario) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorUnitario",
                value: "El valor unitario no puede ser negativo",
            },
        });
    }

    if (
        data.valorBase.toString().includes(",") ||
        data.valorBase.toString().includes(".")
    ) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base no puede contener caracteres especiales como comas o puntos",
            },
        });
    } else if (data.valorBase == 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "Este campo es obligatorio",
            },
        });
    }
    if (isNaN(Number(data.valorBase))) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base debe ser un número",
            },
        });
    }
    if (Number(data.valorBase) < 0) {
        errors.push({
            isError: true,
            field: {
                name: "valorBase",
                value: "El valor base no puede ser negativo",
            },
        });
    }

    if (!data.modoCobro) {
        errors.push({
            isError: true,
            field: {
                name: "modoCobro",
                value: "Este campo es obligatorio",
            },
        });
    } else if (data.modoCobro.toString().length > 25) {
        errors.push({
            isError: true,
            field: {
                name: "modoCobro",
                value: "El modo de cobro no puede tener más de 25 caracteres",
            },
        });
    }

    return errors;
}
