export const formatCurrency = (value: number | string): string => {
    if (value === "" || value == null) {
        value = 0;
    }
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numericValue)) {
        return "$ 0";
    }
    return `$ ${numericValue.toLocaleString("es-CO")}`;
};

export const formatNumber = (value: number | string) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return numericValue.toLocaleString("es-CO");
};
