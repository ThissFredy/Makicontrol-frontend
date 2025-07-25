import {
    getReadyApi,
    getCountersByNitApi,
    getCountersBySerialApi,
    getPendingCountersApi,
    registerCounterApi,
    registerCountersApi,
} from "@/api/counterApi";
import { OperationType } from "@/types/operationType";
import type { GetReadyType, RegisterCounterType } from "@/types/counterType";

export const getReadyService = async (
    nit: string,
    anio: number,
    mes: number
): Promise<OperationType<GetReadyType[]>> => {
    try {
        const response = await getReadyApi(nit, anio, mes);

        if (response.success) {
            return {
                status: true,
                message: "Contadores preparados correctamente",
                data: response.data ?? [],
            } as OperationType<GetReadyType[]>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener los contadores",
                data: [],
            } as OperationType<GetReadyType[]>;
        }
    } catch (error) {
        console.error(
            "Error en el servicio de preparación de contadores:",
            error
        );
        return {
            status: false,
            message: "Error al preparar los contadores",
            data: [],
        } as OperationType<GetReadyType[]>;
    }
};

export const getCountersByNitService = async (
    nit: string,
    anio: number,
    mes: number
): Promise<OperationType<null>> => {
    try {
        const response = await getCountersByNitApi(nit, anio, mes);
        if (response.success) {
            return {
                status: true,
                message: "Contadores obtenidos correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener los contadores",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de contadores:", error);
        return {
            status: false,
            message: "Error al obtener los contadores",
            data: null,
        } as OperationType<null>;
    }
};

export const getCountersBySerialService = async (
    serial: string,
    anio: number,
    mes: number
): Promise<OperationType<null>> => {
    try {
        const response = await getCountersBySerialApi(serial, anio, mes);
        if (response.success) {
            return {
                status: true,
                message: "Contadores por serial obtenidos correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message:
                    response.message ||
                    "Error al obtener los contadores por serial",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de contadores por serial:", error);
        return {
            status: false,
            message: "Error al obtener los contadores por serial",
            data: null,
        } as OperationType<null>;
    }
};

export const getPendingCountersService = async (
    nit: string,
    anio: number,
    mes: number
): Promise<OperationType<null>> => {
    try {
        const response = await getPendingCountersApi(nit, anio, mes);
        if (response.success) {
            return {
                status: true,
                message: "Contadores pendientes obtenidos correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message:
                    response.message ||
                    "Error al obtener los contadores pendientes",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de contadores pendientes:", error);
        return {
            status: false,
            message: "Error al obtener los contadores pendientes",
            data: null,
        } as OperationType<null>;
    }
};

export const registerCounterService = async (
    data: RegisterCounterType
): Promise<OperationType<null>> => {
    try {
        const response = await registerCounterApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Contador registrado correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message: response.message || "Error al registrar el contador",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de registro de contador:", error);
        return {
            status: false,
            message: "Error al registrar el contador",
            data: null,
        } as OperationType<null>;
    }
};

export const registerCountersService = async (
    data: RegisterCounterType[]
): Promise<OperationType<null>> => {
    try {
        const response = await registerCountersApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Contadores registrados correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message:
                    response.message || "Error al registrar los contadores",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de registro de contadores:", error);
        return {
            status: false,
            message: "Error al registrar los contadores",
            data: null,
        } as OperationType<null>;
    }
};
