import React from "react";

interface StatusBadgeProps {
    status: "Activo" | "Inactivo";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const baseClasses =
        "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusClasses =
        status === "Activo"
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};
