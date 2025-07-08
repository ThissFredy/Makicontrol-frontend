import type { CustomerResponseType } from "@/types/customerType";
import type { CustomerType } from "@/types/customerType";
import { getCustomers } from "@/api/customerApi";
import { OperationType } from "@/types/operationType";
/**
 * Fetches the list of customers from the API.
 * @returns A promise that resolves to an array of CustomerType.
 * @throws An error if the API call fails.
 */

export async function customerService(): Promise<
    OperationType<CustomerResponseType<CustomerType>>
> {
    try {
        const response = await getCustomers();
        if (response.success) {
            return {
                status: true,
                message: "Clientes obtenidos correctamente",
                data: { data: response.data ?? [] },
            } as OperationType<CustomerResponseType<CustomerType>>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener los clientes",
                data: { data: response.data ?? [] },
            } as OperationType<CustomerResponseType<CustomerType>>;
        }
    } catch (error) {
        console.error("Error en el servicio de clientes:", error);
        return {
            status: false,
            message: "Error al obtener los clientes",
            data: { data: [] },
        } as OperationType<CustomerResponseType<CustomerType>>;
    }
}
