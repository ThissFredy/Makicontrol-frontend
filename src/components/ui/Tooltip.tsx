interface Tooltip {
    children: React.ReactNode;
    text: string;
    position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ children, text, position = "top" }: Tooltip) => {
    const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    return (
        <div className="relative group inline-block">
            {children}
            <div
                className={`absolute ${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50`}
            >
                <div className="bg-gray-900 text-white text-xs rounded-md py-2 px-3 whitespace-nowrap">
                    {text}
                </div>
                {position === "top" && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                )}
                {position === "bottom" && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                )}
            </div>
        </div>
    );
};
