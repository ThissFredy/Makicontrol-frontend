import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/utilities/moneyUtility";

interface CurrencyInputProps {
    value: number | string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    [key: string]: any;
    input: boolean;
}

// Component for inputs
export const CurrencyInput = ({
    value,
    onChange,
    input = true,
    ...props
}: CurrencyInputProps) => {
    const [displayValue, setDisplayValue] = useState<string>(
        formatCurrency(value)
    );

    useEffect(() => {
        setDisplayValue(formatCurrency(value));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericString = rawValue.replace(/[^0-9]/g, "");
        const numericValue = parseInt(numericString, 10) || 0;

        if (onChange) {
            onChange(e);
        }

        setDisplayValue(formatCurrency(numericValue));
    };

    const handleBlur = () => {
        setDisplayValue(formatCurrency(value));
    };

    return (
        <div>
            {input ? (
                <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    {...props}
                />
            ) : (
                displayValue
            )}
        </div>
    );
};
