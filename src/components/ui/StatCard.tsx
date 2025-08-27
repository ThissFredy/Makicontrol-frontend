import React from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    description: string;
    color?: string;
    icon?: React.ReactNode;
}

export const StatCard = ({
    title,
    value,
    description,
    color,
    icon,
}: StatCardProps) => {
    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200`}
        >
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <div
                className={`flex items-center justify-between mt-2 text-4xl font-bold ${color}`}
            >
                {value}
                {icon && <div className="mr-2">{icon}</div>}
            </div>

            <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
    );
};
