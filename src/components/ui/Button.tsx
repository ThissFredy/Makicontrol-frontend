import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactElement;
}

export const Button = ({ children, icon, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            className="flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-colors"
        >
            {icon}
            {children}
        </button>
    );
};
