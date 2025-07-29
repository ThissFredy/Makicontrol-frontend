import type { RegisterCounterType } from "@/types/counterType";
import type { ErrorFieldType } from "@/types/errorType";

export function validateCounterCreateArray(
    data: RegisterCounterType[]
): ErrorFieldType[] {
    const errors: ErrorFieldType[] = [];

    var flag: boolean = false;

    for (const [index, item] of data.entries()) {
        if (Number(item.cantidad) < 0) {
            flag = true;
        }
        if (isNaN(Number(item.cantidad))) {
            flag = true;
        }
    }

    if (flag) {
        errors.push({
            isError: true,
            field: {
                name: "cantidad",
                value: "Algunos campos tienen valores no válidos",
            },
        });
    }

    return errors;
}

export function validateCounterCreate(data: RegisterCounterType) {
    var errors: ErrorFieldType = {
        isError: false,
        field: {
            name: "",
            value: "",
        },
    };

    var flag: boolean = false;

    if (Number(data.cantidad) < 0) {
        flag = true;
    }
    if (isNaN(Number(data.cantidad))) {
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
