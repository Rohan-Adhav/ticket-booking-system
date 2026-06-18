export default function Input({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    inputClassName = "",
    labelClassName = "",
    wrapperClassName = "",
    error = "",
    required = false,
    autoComplete = "off"
}) {
    const inputId = `${name}-input`;
    const errorId = `${name}-error`;

    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            
            <label
                htmlFor={inputId}
                className={`text-sm text-gray-300 ${labelClassName}`}
            >
                {label}
                {required && (
                    <span className="text-red-400 ml-1">*</span>
                )}
            </label>

            <input
                id={inputId}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}

                className={`w-full px-4 py-3 rounded-xl border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition
                ${error 
                    ? "border-red-400 focus:ring-red-500" 
                    : "border-white/20 focus:ring-purple-500"
                }
                ${inputClassName}`}
            />

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-xs text-red-400 mt-1"
                >
                    {error}
                </p>
            )}
        </div>
    );
}