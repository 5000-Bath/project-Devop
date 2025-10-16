import React from 'react';

export default function Button({ children, onClick, variant = "primary", disabled = false, ...rest }) {
    const baseStyle = {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        fontWeight: "500",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
        fontSize: "14px",
        opacity: disabled ? 0.5 : 1,
    };
    const variants = {
        primary: {
            background: "linear-gradient(135deg, #22c55e 0%, #059669 100%)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
        },
        ghost: {
            background: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
        },
        danger: {
            background: "#ef4444",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
        },
    };
    const style = { ...baseStyle, ...(variants[variant] || variants.primary) };
    const handleMouseOver = (e) => {
        if (!disabled) {
            e.currentTarget.style.boxShadow =
                variant === "ghost" ? "0 2px 8px rgba(0,0,0,0.1)" : "0 6px 20px rgba(34, 197, 94, 0.4)";
            e.currentTarget.style.transform = "translateY(-2px)";
        }
    };
    const handleMouseOut = (e) => {
        if (!disabled) {
            e.currentTarget.style.boxShadow =
                variant === "ghost" ? "none" : "0 4px 15px rgba(34, 197, 94, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
        }
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={style}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            {...rest}
        >
            {children}
        </button>
    );
}
