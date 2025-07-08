export interface CustomerType {
    nombre: string;
    nit: number;
    direccion: string;
    telefono: string;
    correo: string;
}

export interface CustomerResponseType<CustomerType> {
    data: CustomerType[];
}

export interface CustomerCreateType {
    nombre: string;
    nit: number;
    direccion: string;
    telefono: string;
    correo: string;
}
