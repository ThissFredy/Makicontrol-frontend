import type {
    ContractCreateType,
    ContractType,
    ContractDetailType,
    CreateContractDetailType,
} from "@/types/contractType";
import type { ApiResponse } from "@/types/apiType";
import { apiService, apiServiceFile } from "@/api/api";

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

export async function getCanonKindsApi(): Promise<ApiResponse<string[]>> {
    const response = await apiService<string[]>("/api/contratos/grupos-canon", {
        method: "GET",
    });
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

export async function getContractByIdApi(
    id: string
): Promise<ApiResponse<ContractType>> {
    const response = await apiService<ContractType>(
        `/api/contratos/search/nit?nit=${id}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function uploadContractsFileApi(
    file: FormData
): Promise<ApiResponse<string>> {
    console.log("Subiendo archivo de contratos:", file);
    const response = await apiServiceFile<string>("/api/contratos/upload", {
        method: "POST",
        body: file,
    });

    return response;
}

export async function uploadDetailsContractsFileApi(
    file: FormData
): Promise<ApiResponse<string>> {
    console.log("Subiendo archivo de detalles de contratos:", file);
    const response = await apiServiceFile<string>(
        "/api/detalleContrato/upload",
        {
            method: "POST",
            body: file,
        }
    );

    return response;
}

export async function getContractDetailsApi(
    id: number
): Promise<ApiResponse<ContractDetailType>> {
    const response = await apiService<ContractDetailType>(
        `/api/detalleContrato/search/clienteNit?clienteNit=${id}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getOperationsTypesApi(): Promise<ApiResponse<string[]>> {
    const response = await apiService<string[]>(
        "/api/contadores/tipos-operacion",
        {
            method: "GET",
        }
    );

    return response;
}

export async function updateContractDetailsApi(
    data: ContractDetailType
): Promise<ApiResponse<ContractDetailType>> {
    const response = await apiService<ContractDetailType>(
        `/api/detalleContrato/id/${data.id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );

    return response;
}

export async function createContractDetailsApi(
    data: CreateContractDetailType
): Promise<ApiResponse<null>> {
    const response = await apiService<null>("/api/detalleContrato", {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}
