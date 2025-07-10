export interface CustomerType {
    nombre: string;
    nit: number;
    direccion: string;
    telefono: string;
    correo: string;
}

export interface CustomerGetResponseType<CustomerType> {
    data: CustomerType[];
}

export interface CustomerCreateType {
    nombre: string;
    nit: number;
    direccion: string;
    telefono: string;
    correo: string;
}

export interface CustomerCreateResponseType<CustomerType> {
    data: CustomerType[];
}
export interface CustomerUpdateType {
    id: string;
    nombre: string;
    nit: number;
    direccion: string;
    telefono: string;
    correo: string;
}
