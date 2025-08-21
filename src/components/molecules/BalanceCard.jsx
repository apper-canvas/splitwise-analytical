import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const BalanceCard = ({ 
  className,
  title,
  amount,
  currency = "USD",
  type = "neutral",
  subtitle,
  icon,
  onClick
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "owe":
        return "text-danger";
      case "owed":
        return "text-success";
      case "settled":
        return "text-gray-600";
      default:
        return "text-gray-900";
    }
  };

  const formatAmount = (amount) => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2
    }).format(absAmount);
  };

  return (
    <Card 
      className={cn(
        "balance-card cursor-pointer hover:shadow-xl transition-all duration-200",
        onClick && "hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
              <ApperIcon name={icon} size={16} className="text-primary" />
            </div>
          )}
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {type !== "neutral" && (
          <Badge 
            variant={type === "owe" ? "danger" : type === "owed" ? "success" : "default"}
            size="sm"
          >
            {type === "owe" ? "You owe" : type === "owed" ? "You're owed" : "Settled"}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <p className={cn(
          "text-3xl font-bold font-display number-counter",
          getTypeStyles()
        )}>
          {formatAmount(amount)}
        </p>
        
        {subtitle && (
          <p className="text-sm text-gray-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

export default BalanceCard;