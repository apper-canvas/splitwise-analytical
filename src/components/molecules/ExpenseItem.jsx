import React from "react";
import { cn } from "@/utils/cn";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ExpenseItem = ({ 
  className,
  expense,
  onClick,
  showPaidBy = true,
  showSplitInfo = true
}) => {
  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSplitText = (expense) => {
    if (expense.splitMethod === "equal") {
      return `Split ${expense.splitBetween.length} ways`;
    } else if (expense.splitMethod === "custom") {
      return "Custom split";
    } else if (expense.splitMethod === "percentage") {
      return "Percentage split";
    }
    return "Split";
  };

  return (
    <div 
      className={cn(
        "expense-item bg-white rounded-2xl p-4 shadow-lg border border-gray-100",
        "cursor-pointer transition-all duration-200 ease-out",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Expense Icon/Category */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <ApperIcon 
            name={expense.category === "food" ? "Utensils" : 
                  expense.category === "transport" ? "Car" :
                  expense.category === "entertainment" ? "Film" :
                  "Receipt"} 
            size={20} 
            className="text-primary" 
          />
        </div>

        {/* Expense Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 font-display truncate">
                {expense.description}
              </h4>
              {showPaidBy && (
                <p className="text-sm text-gray-500">
                  Paid by <span className="font-medium">{expense.paidBy}</span>
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-lg font-bold text-gray-900 font-display">
                {formatAmount(expense.amount, expense.currency)}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(expense.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Split Info and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {showSplitInfo && (
                <Badge variant="outline" size="sm">
                  <ApperIcon name="Users" size={12} className="mr-1" />
                  {getSplitText(expense)}
                </Badge>
              )}
              
              {expense.settled && (
                <Badge variant="success" size="sm">
                  <ApperIcon name="Check" size={12} className="mr-1" />
                  Settled
                </Badge>
              )}
            </div>

            {/* Member Avatars */}
            <div className="flex -space-x-2">
              {expense.splitBetween.slice(0, 3).map((member, index) => (
                <Avatar 
                  key={index}
                  size="xs"
                  alt={member.name}
                  src={member.avatar}
                  className="ring-2 ring-white"
                />
              ))}
              {expense.splitBetween.length > 3 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 ring-2 ring-white">
                  +{expense.splitBetween.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;