import React from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    description: string;
    color?: string;
}

export const StatCard = ({
    title,
    value,
    description,
    color,
}: StatCardProps) => {
    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200`}
        >
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <p className={`mt-2 text-4xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
    );
};
