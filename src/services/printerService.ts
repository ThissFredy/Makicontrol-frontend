import type { OperationType } from "@/types/operationType";
import {
    getPrintersByNitApi,
    getCanonForPrintersApi,
    setPrintersByNitApi,
    assignPrintersFileApi,
    reAssignPrintersFileApi,
} from "@/api/printerApi";
import type { printerType, printerCreateType } from "@/types/printerType";

export async function getPrintersByNitService(
    nit: string
): Promise<OperationType<printerType[]>> {
    try {
        const response = await getPrintersByNitApi(nit);
        if (response.success) {
            return {
                status: true,
                message: "Impresoras obtenidas correctamente",
                data: response.data ?? [],
            } as OperationType<printerType[]>;
        } else {
            return {
                status: false,
                message: response.message || "Error al obtener las impresoras",
                data: [],
            } as OperationType<printerType[]>;
        }
    } catch (error) {
        console.error("Error en el servicio de impresoras:", error);
        return {
            status: false,
            message: "Error al obtener las impresoras",
            data: [],
        } as OperationType<printerType[]>;
    }
}

export async function setPrintersByNitService(
    data: printerCreateType
): Promise<OperationType<null>> {
    if (data.grupo == "") {
        delete data.grupo;
    }
    try {
        const response = await setPrintersByNitApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Impresora asignada correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message: response.message || "Error al asignar la impresora",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de impresoras:", error);
        return {
            status: false,
            message: "Error al obtener las impresoras",
            data: null,
        } as OperationType<null>;
    }
}

export async function reAssignPrintersService(
    data: printerCreateType
): Promise<OperationType<null>> {
    if (data.grupo == "") {
        delete data.grupo;
    }
    try {
        const response = await reAssignPrintersFileApi(data);
        if (response.success) {
            return {
                status: true,
                message: "Impresora reasignada correctamente",
                data: null,
            } as OperationType<null>;
        } else {
            return {
                status: false,
                message: response.message || "Error al reasignar la impresora",
                data: null,
            } as OperationType<null>;
        }
    } catch (error) {
        console.error("Error en el servicio de impresoras:", error);
        return {
            status: false,
            message: "Error al obtener las impresoras",
            data: null,
        } as OperationType<null>;
    }
}

export async function getCanonForPrintersService(): Promise<
    OperationType<string[]>
> {
    try {
        const response = await getCanonForPrintersApi();
        if (response.success) {
            return {
                status: true,
                message: "Grupos Canon obtenidos correctamente",
                data: response.data ?? [],
            } as OperationType<string[]>;
        } else {
            return {
                status: false,
                message:
                    response.message || "Error al obtener los grupos Canon",
                data: [],
            } as OperationType<string[]>;
        }
    } catch (error) {
        console.error("Error en el servicio de grupos Canon:", error);
        return {
            status: false,
            message: "Error al obtener los grupos Canon",
            data: [],
        } as OperationType<string[]>;
    }
}

export async function assignPrintersFileService(
    formData: FormData
): Promise<OperationType<null>> {
    try {
        const response = await assignPrintersFileApi(formData);

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

export async function uploadPrintersByFileService(
    formData: FormData
): Promise<OperationType<null>> {
    try {
        const response = await assignPrintersFileApi(formData);

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
