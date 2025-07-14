import type { ContractType, ContractCreateType } from "@/types/contractType";

import {
    getContractsApi,
    getContractByIdApi,
    createContractApi,
    getContractByNitAndStatusApi,
    updateContractApi,
    getCanonKindsApi,
    getTypesOfContractsApi,
    uploadContractsFileApi,
} from "@/api/contractApi";

import { getCustomerByNIT } from "@/api/customerApi";
import { OperationType } from "@/types/operationType";
/**
 * Fetches the list of customers from the API.
 * @returns A promise that resolves to an array of CustomerType.
 * @throws An error if the API call fails.
 */
export async function getContractsService(): Promise<
    OperationType<ContractType[]>
> {
    try {
        const response = await getContractsApi();
        if (response.success) {
            return {
                status: true,
                message: "Contratos obtenidos correctamente",
                data: response.data ?? [],
            } as OperationType<ContractType[]>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener los contratos",
                data: response.data ?? [],
            } as OperationType<ContractType[]>;
        }
    } catch (error) {
        console.error("Error en el servicio de contratos:", error);
        return {
            status: false,
            message: "Error al obtener los contratos",
            data: [],
        } as OperationType<ContractType[]>;
    }
}

export async function createContractService(
    data: ContractCreateType
): Promise<OperationType<ContractType>> {
    try {
        const response = await createContractApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Contrato creado correctamente",
                data: data,
            } as OperationType<ContractType>;
        } else {
            return {
                status: false,
                message: response.message || "Error al crear el contrato",
                data: data,
            } as OperationType<ContractType>;
        }
    } catch (error) {
        console.error("Error en el servicio de creación de contrato:", error);
        return {
            status: false,
            message: "Error al crear el contrato",
            data: data,
        } as OperationType<ContractType>;
    }
}

export async function getTypesOfContractsService(): Promise<
    OperationType<string[]>
> {
    try {
        const response = await getTypesOfContractsApi();
        if (response.success) {
            return {
                status: true,
                message: "Tipos de contrato obtenidos correctamente",
                data: response.data ?? [],
            } as OperationType<string[]>;
        } else {
            return {
                status: false,
                message:
                    response.message ||
                    "Error al obtener los tipos de contrato",
                data: [],
            } as OperationType<string[]>;
        }
    } catch (error) {
        console.error(
            "Error en el servicio de obtención de tipos de contrato:",
            error
        );
        return {
            status: false,
            message: "Error al obtener los tipos de contrato",
            data: [],
        } as OperationType<string[]>;
    }
}

export async function getTypesOfCanonService(): Promise<
    OperationType<string[]>
> {
    try {
        const response = await getCanonKindsApi();
        if (response.success) {
            return {
                status: true,
                message: "Tipos de canon obtenidos correctamente",
                data: response.data ?? [],
            } as OperationType<string[]>;
        } else {
            return {
                status: false,
                message:
                    response.message || "Error al obtener los tipos de canon",
                data: [],
            } as OperationType<string[]>;
        }
    } catch (error) {
        console.error(
            "Error en el servicio de obtención de tipos de canon:",
            error
        );
        return {
            status: false,
            message: "Error al obtener los tipos de canon",
            data: [],
        } as OperationType<string[]>;
    }
}

export async function searchCustomerByNitAndStatusService(
    nit: string,
    status: string
): Promise<OperationType<ContractType[]>> {
    try {
        const data = await getContractByNitAndStatusApi(nit, status);
        return {
            status: data.success,
            message:
                data.message || "Contratos obtenidos correctamente por NIT",
            data: data.data ?? [],
        } as OperationType<ContractType[]>;
    } catch (error) {
        console.error(
            "Error en el servicio de búsqueda de contratos por NIT:",
            error
        );
        return {
            status: false,
            message: "Error al buscar contratos por NIT",
            data: [],
        } as OperationType<ContractType[]>;
    }
}

export async function searchCustomerByNITService(
    nit: string
): Promise<OperationType<ContractType[]>> {
    try {
        const data = await getContractByIdApi(nit);
        return {
            status: data.success,
            message:
                data.message || "Contratos obtenidos correctamente por NIT",
            data: data.data ?? [],
        } as OperationType<ContractType[]>;
    } catch (error) {
        console.error(
            "Error en el servicio de búsqueda de contratos por NIT:",
            error
        );
        return {
            status: false,
            message: "Error al buscar contratos por NIT",
            data: [],
        } as OperationType<ContractType[]>;
    }
}

export async function updateCustomerService(
    data: ContractType
): Promise<OperationType<ContractType>> {
    try {
        const response = await updateContractApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Contrato actualizado correctamente",
                data: data,
            } as OperationType<ContractType>;
        } else {
            return {
                status: false,
                message: response.message || "Error al actualizar el contrato",
            } as OperationType<ContractType>;
        }
    } catch (error) {
        console.error(
            "Error en el servicio de actualización de contrato:",
            error
        );
        return {
            status: false,
            message: "Error al actualizar el contrato",
        } as OperationType<ContractType>;
    }
}

export async function getNitExistsService(
    nit: string
): Promise<OperationType<boolean>> {
    try {
        const response = await getCustomerByNIT(nit);
        if (response.success) {
            return {
                status: true,
                message: "NIT verificado correctamente",
                data: true,
            } as OperationType<boolean>;
        } else {
            return {
                status: false,
                message: response.message || "Error al verificar el NIT",
                data: false,
            } as OperationType<boolean>;
        }
    } catch (error) {
        console.error("Error al verificar el NIT:", error);
        return {
            status: false,
            message: "Error al verificar el NIT",
            data: false,
        } as OperationType<boolean>;
    }
}

export async function uploadContractsFileService(
    formData: FormData
): Promise<OperationType<null>> {
    try {
        const response = await uploadContractsFileApi(formData);
        console.log("Response from uploadContractsFileApi:", response);

        if (!response.success) {
            return {
                status: false,
                message: response.message || "Error al procesar el archivo",
                data: null,
            } as OperationType<null>;
        }

        return {
            status: response.success,
            message: response.message || "Archivo procesado exitosamente",
            data: null,
        } as OperationType<null>;
    } catch (error) {
        console.error("Error en el servicio de subida de archivo:", error);
        return {
            status: false,
            message: "Error al procesar el archivo",
            data: null,
        } as OperationType<null>;
    }
}
