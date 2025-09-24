export const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses =
        "px-2 py-1 text-xs font-semibold rounded-full inline-block";
    const statusStyles: { [key: string]: string } = {
        Facturado: "bg-green-100 text-green-700",
        Pendiente: "bg-yellow-100 text-yellow-700",
        Vencido: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`${baseClasses} ${
                statusStyles[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );
};
