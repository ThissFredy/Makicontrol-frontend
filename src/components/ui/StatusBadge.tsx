import React from "react";

interface StatusBadgeProps {
    status: "Activo" | "Inactivo" | "Pendiente";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const baseClasses =
        "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusClasses =
        status === "Activo"
            ? "bg-green-100 text-green-800"
            : status === "Inactivo"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

interface StatusBadgeReportsProps {
    status: "Facturado" | "Vencido" | "Pendiente";
}

export const StatusBadgeReports = ({ status }: StatusBadgeReportsProps) => {
    const baseClasses =
        "px-3 py-1 text-sm font-medium rounded-full inline-block";
    const statusClasses =
        status === "Facturado"
            ? "bg-green-100 text-green-800"
            : status === "Vencido"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};
