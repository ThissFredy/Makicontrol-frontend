import type { RegisterCounterType } from "@/types/counterType";
import type { OperationType } from "@/types/operationType";
export function validateSendCounter(
    data: RegisterCounterType[]
): OperationType<RegisterCounterType[]> {
    // Iterar hacia atrás para evitar problemas con los índices al eliminar
    for (let i = data.length - 1; i >= 0; i--) {
        if (Number(data[i].cantidad) === 0 || data[i].cantidad === "") {
            data.splice(i, 1);
        }
    }

    return {
        status: true,
        message: "Contadores validados correctamente",
        data: data,
    };
}
