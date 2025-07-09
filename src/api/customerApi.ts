import type { CustomerType } from "@/types/customerType";
import type { ApiResponse } from "@/types/apiType";
import { apiService } from "@/api/api";

/**
 * Llama al endpoint de clientes de la API y devuelve una lista de clientes.
 * @returns Una promesa que resuelve a un objeto ApiResponse con los datos de los clientes.
 */
export async function getCustomers(): Promise<ApiResponse<CustomerType[]>> {
    const response = await apiService<CustomerType[]>("/api/clientes", {
        method: "GET",
    });

    return response;
}

export async function createCustomerApi(
    data: CustomerType
): Promise<ApiResponse<CustomerType>> {
    const response = await apiService<CustomerType>("/api/clientes", {
        method: "POST",
        body: JSON.stringify(data),
    });

    return response;
}

export async function getCustomerByName(
    name: string
): Promise<ApiResponse<CustomerType[]>> {
    const response = await apiService<CustomerType[]>(
        `/api/clientes/search/nombre?nombre=${name}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function getCustomerByNIT(
    nit: string
): Promise<ApiResponse<CustomerType[]>> {
    const response = await apiService<CustomerType[]>(
        `/api/clientes/search/NIT?nit=${nit}`,
        {
            method: "GET",
        }
    );

    return response;
}

export async function updateCustomerApi(
    data: CustomerType
): Promise<ApiResponse<CustomerType>> {
    const response = await apiService<CustomerType>(
        `/api/clientes/nit/${data.nit}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );

    return response;
}
