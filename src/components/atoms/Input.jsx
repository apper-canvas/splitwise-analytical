import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 border-gray-200",
          "bg-white text-gray-900 placeholder-gray-500",
          "transition-all duration-200 ease-out",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-danger font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;