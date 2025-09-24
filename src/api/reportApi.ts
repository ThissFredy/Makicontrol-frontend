import { ApiResponse } from "@/types/apiType";
import { apiService } from "@/api/api";
import { ReportType } from "@/types/reportType";

// TODO: Change the URL to the correct endpoint
export async function getReportDataApi(): Promise<ApiResponse<ReportType>> {
    const response = await apiService<ReportType>(`/api/reportes/generar`, {
        method: "GET",
    });

    return response;
}
