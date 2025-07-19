export const formatCurrency = (value: number) => {
    return `$ ${value.toLocaleString("es-CO")}`;
};

// Función para formatear números con separadores de miles (ej: 2000 -> 2.000)
export const formatNumber = (value: number) => {
    return value.toLocaleString("es-CO");
};
