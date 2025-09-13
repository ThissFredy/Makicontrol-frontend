export interface ReportType {
    totalFacturado: {
        mes: number;
        ano: number;
        total: number;
    };
    clientes: [
        {
            clienteNit: string;
            estadoFacturado: string;
        }
    ];
}
