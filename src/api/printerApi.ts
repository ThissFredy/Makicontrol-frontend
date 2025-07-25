import { apiService, apiServiceFile } from "@/api/api";
import type { ApiResponse } from "@/types/apiType";
import type { printerType, printerCreateType } from "@/types/printerType";

// TODO: Path params
export async function getPrintersByNitApi(
    nit: string
): Promise<ApiResponse<printerType[]>> {
    const response = await apiService<printerType[]>(
        `/api/impresoras/activas/${nit}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function setPrintersByNitApi(
    data: printerCreateType
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(`/api/impresoras/asignar`, {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}

export async function getCanonForPrintersApi(): Promise<ApiResponse<string[]>> {
    const response = await apiService<string[]>(`/api/contratos/grupos-canon`, {
        method: "GET",
    });

    return response;
}

export async function reAssignPrintersFileApi(
    data: printerCreateType
): Promise<ApiResponse<null>> {
    const response = await apiService<null>(`/api/impresoras/reasignar`, {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}

export async function assignPrintersFileApi(
    formData: FormData
): Promise<ApiResponse<null>> {
    const response = await apiServiceFile<null>(`/api/impresoras/upload`, {
        method: "POST",
        body: formData,
    });

    return response;
}
