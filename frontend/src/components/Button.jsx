export default function Button({
    children,
    onClick,
    type = "button",
    loading = false,
    disabled = false,
    className = ""
}) {

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                w-full py-3 rounded-xl font-semibold text-white 
                bg-gradient-to-r from-purple-600 to-blue-500 
                hover:from-purple-500 hover:to-blue-400 
                transition flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}