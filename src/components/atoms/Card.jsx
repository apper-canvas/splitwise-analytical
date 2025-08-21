import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-xl",
    primary: "bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl",
    accent: "bg-gradient-to-br from-accent to-green-400 text-white shadow-xl"
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 border border-gray-100",
        "transition-all duration-200 ease-out",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;