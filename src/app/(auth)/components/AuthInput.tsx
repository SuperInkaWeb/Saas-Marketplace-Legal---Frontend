import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | { message?: string };
  rightElement?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      rightElement,
      className = "",
      containerClassName = "",
      labelClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const errorMsg = error?.message;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-semibold text-gray-700 tracking-tight ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm shadow-sm ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-accent focus:ring-4 focus:ring-accent/10"
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {errorMsg && (
          <p className="text-[11px] text-red-600 font-bold px-1 italic tracking-tight">
            {errorMsg}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
