import type { RegisterCounterType } from "@/types/counterType";
import type { ErrorFieldType } from "@/types/errorType";

export function validateCounterCreateArray(
    data: RegisterCounterType[]
): ErrorFieldType[] {
    const errors: ErrorFieldType[] = [];

    data.forEach((item, index) => {
        if (!item.cantidad || !/^\d+$/.test(item.cantidad)) {
            errors.push({
                isError: true,
                field: {
                    name: `cantidad_${index}`,
                    value: `El valor para ${item.serialImpresora} (${item.tipoOperacion}) debe ser un número.`,
                },
            });
        }
        
        const contadorActual = Number(item.cantidad);
        const contadorAnterior = Number(item.contadorAnterior);

        if (!isNaN(contadorActual) && !isNaN(contadorAnterior) && contadorActual < contadorAnterior) {
            errors.push({
                isError: true,
                field: {
                    name: `cantidad_menor_${index}`,
                    value: `El contador actual de ${item.serialImpresora} (${item.tipoOperacion}) no puede ser menor al anterior (${contadorAnterior}).`,
                },
            });
        }
    });

    return errors;
}

export function validateCounterCreate(data: RegisterCounterType) {
    let errors: ErrorFieldType = {
        isError: false,
        field: {
            name: "",
            value: "",
        },
    };

    let flag: boolean = false;

    if (typeof data.cantidad !== "string" || !/^\d+$/.test(data.cantidad)) {
        flag = true;
    }

    if (flag) {
        errors = {
            isError: true,
            field: {
                name: "cantidad",
                value: "Algunos campos tienen valores no válidos",
            },
        };
    }

    return errors;
}
