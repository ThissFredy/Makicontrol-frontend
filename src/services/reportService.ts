import type { ReportType } from "@/types/reportType";
import type { OperationType } from "@/types/operationType";
import { getReportDataApi } from "@/api/reportApi";

/**
 * Get report data from the API.
 * @returns An object containing the operation status, message, and report data. (Type ReportType or empty array)
 */
export async function getReportData(): Promise<
    OperationType<ReportType | null>
> {
    // try {
    //     const response = await getReportDataApi();
    //     if (response.success) {
    //         return {
    //             status: true,
    //             message: "Impresoras obtenidas correctamente",
    //             data: response.data ?? [],
    //         } as OperationType<ReportType>;
    //     } else {
    //         return {
    //             status: false,
    //             message: response.message || "Error al obtener las impresoras",
    //             data: {
    //                 totalFacturado: [],
    //                 clientes: null,
    //             },
    //         };
    //     }
    // } catch (error) {
    //     console.error("Error en el servicio de impresoras:", error);
    //     return {
    //         status: false,
    //         message: "Error al obtener las impresoras",
    //         data: {
    //             totalFacturado: [],
    //             clientes: null,
    //         },
    //     };
    // }

    // ! DELETE THIS MOCK DATA WHEN THE API IS READY
    const data: ReportType = {
        totalFacturado: [
            // Datos de 2024
            { ano: 2024, mes: 1, total: 95000 },
            { ano: 2024, mes: 2, total: 110000 },
            { ano: 2024, mes: 3, total: 85000 },
            { ano: 2024, mes: 4, total: 115000 },
            { ano: 2024, mes: 5, total: 98000 },
            { ano: 2024, mes: 6, total: 135000 },
            { ano: 2024, mes: 7, total: 120000 },
            { ano: 2024, mes: 8, total: 88000 },
            { ano: 2024, mes: 9, total: 150000 },
            { ano: 2024, mes: 10, total: 130000 },
            { ano: 2024, mes: 11, total: 125000 },
            // mes 12 de 2024 sin datos a propósito

            // Datos de 2025
            { ano: 2025, mes: 1, total: 115000 },
            { ano: 2025, mes: 2, total: 120000 },
            { ano: 2025, mes: 3, total: 105000 },
            { ano: 2025, mes: 4, total: 130000 },
            { ano: 2025, mes: 5, total: 118000 },
            { ano: 2025, mes: 6, total: 155000 },
        ],
        clientes: [
            { clienteNit: "1", estadoFacturado: "Facturado" },
            { clienteNit: "2", estadoFacturado: "Pendiente" },
            { clienteNit: "3", estadoFacturado: "Facturado" },
            { clienteNit: "4", estadoFacturado: "Pendiente" },
            { clienteNit: "5", estadoFacturado: "Facturado" },
            { clienteNit: "6", estadoFacturado: "Pendiente" },
            { clienteNit: "7", estadoFacturado: "Facturado" },
            { clienteNit: "8", estadoFacturado: "Vencido" },
        ],
    };

    console.log("Mock report data:", data);

    return {
        status: true,
        message: "Datos de reporte obtenidos correctamente (mock)",
        data: data,
    };
}
