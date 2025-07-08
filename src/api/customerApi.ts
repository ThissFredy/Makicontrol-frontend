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
    console.log("Respuesta de clientes:", response);

    return response;
}
