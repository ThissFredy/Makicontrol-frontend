export interface printerType {
    serial: string;
    modelo: string;
}

export interface printerCreateType {
    clienteNit: string;
    serial: string;
    modelo: string;
    grupo?: string;
    fechaInicio: string;
}
