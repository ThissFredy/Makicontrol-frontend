export interface GetReadyType {
    serial: string;
    modelo: string;
    tipoOperacion: string;
    contadorAnterior: string;
    contadorActual: string;
    consumo: string;
}

export interface RegisterCounterType {
    serialImpresora: string;
    anio: string;
    mes: string;
    tipoOperacion: string;
    cantidad: string;
}
