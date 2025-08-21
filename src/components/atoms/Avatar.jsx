import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  src,
  alt,
  size = "md",
  children,
  ...props 
}, ref) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl"
  };

  const fallbackContent = children || alt?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full",
        "bg-gradient-to-br from-primary to-primary-dark text-white font-semibold",
        "shadow-lg ring-2 ring-white",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        fallbackContent
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;