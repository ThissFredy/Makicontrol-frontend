import type { CustomerGetResponseType } from "@/types/customerType";
import type { CustomerCreateResponseType } from "@/types/customerType";
import type { CustomerUpdateType } from "@/types/customerType";
import type { CustomerType } from "@/types/customerType";
import { getCustomers } from "@/api/customerApi";
import { createCustomerApi } from "@/api/customerApi";
import { updateCustomerApi } from "@/api/customerApi";
import { OperationType } from "@/types/operationType";
import { getCustomerByNIT, getCustomerByName } from "@/api/customerApi";
/**
 * Fetches the list of customers from the API.
 * @returns A promise that resolves to an array of CustomerType.
 * @throws An error if the API call fails.
 */

export async function getCustomer(): Promise<
    OperationType<CustomerGetResponseType<CustomerType>>
> {
    try {
        const response = await getCustomers();
        if (response.success) {
            return {
                status: true,
                message: "Clientes obtenidos correctamente",
                data: { data: response.data ?? [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener los clientes",
                data: { data: response.data ?? [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        }
    } catch (error) {
        console.error("Error en el servicio de clientes:", error);
        return {
            status: false,
            message: "Error al obtener los clientes",
            data: { data: [] },
        } as OperationType<CustomerGetResponseType<CustomerType>>;
    }
}

export async function createCustomer(
    data: CustomerType
): Promise<OperationType<CustomerCreateResponseType<CustomerType>>> {
    try {
        const response = await createCustomerApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Cliente creado correctamente",
                data: { data: response.data ? [response.data] : [] },
            } as OperationType<CustomerCreateResponseType<CustomerType>>;
        } else {
            return {
                status: false,
                message: response.message || "Error al crear el cliente",
                data: { data: response.data ? [response.data] : [] },
            } as OperationType<CustomerCreateResponseType<CustomerType>>;
        }
    } catch (error) {
        console.error("Error en el servicio de creación de cliente:", error);
        return {
            status: false,
            message: "Error al crear el cliente",
            data: { data: [] },
        } as OperationType<CustomerCreateResponseType<CustomerType>>;
    }
}

export async function searchCustomerByNameOrNIT(
    searchTerm: string
): Promise<OperationType<CustomerGetResponseType<CustomerType>>> {
    if (!isNaN(Number(searchTerm)) && searchTerm.trim() !== "") {
        try {
            const data = await getCustomerByNIT(searchTerm);
            return {
                status: data.success,
                message:
                    data.message || "Clientes obtenidos correctamente por NIT",
                data: { data: data.data ?? [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        } catch (error) {
            console.error(
                "Error en el servicio de búsqueda de clientes por NIT:",
                error
            );
            return {
                status: false,
                message: "Error al buscar clientes por NIT",
                data: { data: [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        }
    } else {
        try {
            const response = await getCustomerByName(searchTerm);
            return {
                status: response.success,
                message:
                    response.message ||
                    "Clientes obtenidos correctamente por nombre",
                data: { data: response.data ?? [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        } catch (error) {
            console.error(
                "Error en el servicio de búsqueda de clientes por nombre:",
                error
            );
            return {
                status: false,
                message: "Error al buscar clientes por nombre",
                data: { data: [] },
            } as OperationType<CustomerGetResponseType<CustomerType>>;
        }
    }
}

export async function updateCustomer(
    data: CustomerType
): Promise<OperationType<CustomerUpdateType>> {
    try {
        const response = await updateCustomerApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Cliente actualizado correctamente",
                data: response.data,
            } as OperationType<CustomerUpdateType>;
        } else {
            return {
                status: false,
                message: response.message || "Error al actualizar el cliente",
                data: {
                    id: "",
                    nombre: "",
                    nit: 0,
                    direccion: "",
                    telefono: "",
                    correo: "",
                },
            } as OperationType<CustomerUpdateType>;
        }
    } catch (error) {
        console.error(
            "Error en el servicio de actualización de cliente:",
            error
        );
        return {
            status: false,
            message: "Error al actualizar el cliente",
            data: {
                id: "",
                nombre: "",
                nit: 0,
                direccion: "",
                telefono: "",
                correo: "",
            },
        } as OperationType<CustomerUpdateType>;
    }
}
