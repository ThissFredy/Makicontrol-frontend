import type { RegisterCounterType } from "@/types/counterType";
import type { ErrorFieldType } from "@/types/errorType";

export function validateCounterCreateArray(
    data: RegisterCounterType[]
): ErrorFieldType[] {
    const errors: ErrorFieldType[] = [];

    var flag: boolean = false;

    for (const item of data) {
        if (typeof item.cantidad !== "string" || !/^\d+$/.test(item.cantidad)) {
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
