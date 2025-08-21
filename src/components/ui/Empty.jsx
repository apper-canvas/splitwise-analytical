import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "Receipt", 
  title = "No expenses yet",
  message = "Start by adding your first expense or creating a group to begin tracking shared costs.",
  actionLabel = "Add Expense",
  onAction,
  showAction = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 floating">
        <ApperIcon name={icon} size={48} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showAction && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;