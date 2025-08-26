import { apiService } from "@/api/api";
import type { ApiResponse } from "@/types/apiType";
import type { GetReadyType, RegisterCounterType } from "@/types/counterType";

export async function getReadyApi(
    nit: string,
    anio: number,
    mes: number
): Promise<ApiResponse<GetReadyType[]>> {
    const response = await apiService<GetReadyType[]>(
        `/api/contadores/preparar-contadores?clienteNit=${nit}&anio=${anio}&mes=${mes}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getCountersByNitApi(
    nit: string,
    anio: number,
    mes: number
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(
        `/api/contadores/cliente?clienteNit=${nit}&anio=${anio}&mes=${mes}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getCountersBySerialApi(
    serial: string,
    anio: number,
    mes: number
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(
        `/api/contadores/impresora-serial?serial=${serial}&anio=${anio}&mes=${mes}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getPendingCountersApi(
    nit: string,
    anio: number,
    mes: number
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(
        `/api/contadores/pendientes?clienteNit=${nit}&anio=${anio}&mes=${mes}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function registerCounterApi(
    data: RegisterCounterType
): Promise<ApiResponse<null>> {
    const response = await apiService<null>("/api/contadores/registrar", {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}

export async function registerCountersApi(
    data: RegisterCounterType[]
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(
        "/api/contadores/registrar-masivo",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    return response;
}
