export type ContractStatus = "ACTIVO" | "INACTIVO";
export type CanonGroup = "BN" | "COLOR" | "ZEBRA" | "ESCANER";

export interface Canon {
    grupo: CanonGroup;
    valorCanon: number;
}

export interface ContractGetResponseType<ContractType> {
    data: ContractType[];
}

export interface ContractType {
    clienteNit: number;
    tipoContrato: string;
    valorCanon: string;
    valorBaseEquipo: string;
    periodo: string;
    fechaInicio: string;
    fechaFin: string | null;
    estado: ContractStatus;
    canones: Canon[];
}

export interface ContractCreateType {
    clienteNit: number;
    tipoContrato: string;
    valorCanon: string;
    valorBaseEquipo: string;
    periodo: string;
    fechaInicio: string;
    fechaFin?: string | null;
    estado?: ContractStatus;
}

export interface ContractCreateCanonType {
    clienteNit: number;
    tipoContrato: string;
    valorCanon: string;
    valorBaseEquipo: string;
    periodo: string;
    fechaInicio: string;
    fechaFin?: string | null;
    estado: ContractStatus;
    canones: Canon[];
}

export interface ContractCreateResponseType<ContractType> {
    data: ContractType[];
}

export interface ContractUpdateType {
    clienteNit: number;
    tipoContrato: string;
    valorCanon: number;
    valorBaseEquipo: number;
    periodo: string;
    fechaInicio: string;
    fechaFin?: string | null;
    estado?: ContractStatus;
}
