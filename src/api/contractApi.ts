import type { ContractCreateType, ContractType } from "@/types/contractType";
import type { ApiResponse } from "@/types/apiType";
import { apiService } from "@/api/api";

/**
 * Llama al endpoint de contratos de la API y devuelve una lista de contratos.
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos de los contratos.
 */
export async function getContractsApi(): Promise<ApiResponse<ContractType[]>> {
    const response = await apiService<ContractType[]>("/api/contratos", {
        method: "GET",
    });

    return response;
}

export async function createContractApi(
    data: ContractCreateType
): Promise<ApiResponse<ContractType>> {
    const response = await apiService<ContractType>("/api/contratos", {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}

export async function getContractByNitAndStatusApi(
    nit: string,
    status: string
): Promise<ApiResponse<ContractType[]>> {
    const response = await apiService<ContractType[]>(
        `/api/contratos/search/NITEstado?nit=${nit}&estado=${status}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getContractByNITApi(
    nit: string
): Promise<ApiResponse<ContractType[]>> {
    const response = await apiService<ContractType[]>(
        `/api/contratos/search/nit?nit=${nit}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function updateContractApi(
    data: ContractType
): Promise<ApiResponse<ContractType>> {
    const response = await apiService<ContractType>(
        `/api/contratos/nit/${data.clienteNit}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );

    return response;
}

export async function getContractsKindsApi(): Promise<ApiResponse<string[]>> {
    const response = await apiService<string[]>(
        "/api/contratos/tipos-contrato",
        {
            method: "GET",
        }
    );

    return response;
}

export async function getTypesOfContractsApi(): Promise<ApiResponse<string[]>> {
    const response = await apiService<string[]>(
        "/api/contratos/tipos-contrato",
        {
            method: "GET",
        }
    );

    return response;
}
