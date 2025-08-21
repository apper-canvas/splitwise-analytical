import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white",
    accent: "bg-gradient-to-r from-accent to-green-400 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-500 text-white",
    danger: "bg-gradient-to-r from-danger to-red-600 text-white",
    outline: "border-2 border-primary text-primary bg-transparent"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs rounded-lg",
    md: "px-3 py-1.5 text-sm rounded-xl",
    lg: "px-4 py-2 text-base rounded-xl"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-200 ease-out",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;