    import React, { ChangeEvent } from 'react'

    interface InputProps {
        type?: any;
        value?: any;
        onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean;
        placeholder?: string;
        className?: string;
        accept?: string;  // For file input, to specify acceptable file types
    }


    export default function Input({
        type,
        value,
        onChange,
        disabled,
        placeholder,
        className,
        accept,

    }: InputProps) {
        return (
        <div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    accept={accept} // Used only if type="file"
                    className={className}
                />
        </div>
    )
    }
