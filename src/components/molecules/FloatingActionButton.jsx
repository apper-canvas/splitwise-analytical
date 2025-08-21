import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FloatingActionButton = ({ 
  className,
  onClick,
  icon = "Plus",
  variant = "primary"
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-xl",
        "floating-pulse hover:scale-110 transition-all duration-200",
        "z-40",
        className
      )}
    >
      <ApperIcon name={icon} size={24} />
    </Button>
  );
};

export default FloatingActionButton;