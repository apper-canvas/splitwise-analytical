import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SplitMethodSelector = ({ 
  className,
  value = "equal",
  onChange,
  members = [],
  totalAmount = 0,
  splits = {}
}) => {
  const [activeMethod, setActiveMethod] = useState(value);

  const methods = [
    {
      id: "equal",
      name: "Equal Split",
      icon: "Users",
      description: "Split equally among all members"
    },
    {
      id: "custom",
      name: "Custom Amount",
      icon: "Calculator",
      description: "Set specific amounts for each person"
    },
    {
      id: "percentage",
      name: "Percentage",
      icon: "PieChart",
      description: "Split by percentage shares"
    }
  ];

  const handleMethodChange = (methodId) => {
    setActiveMethod(methodId);
    onChange(methodId, {});
  };

  const handleSplitChange = (memberId, value, type = "amount") => {
    const newSplits = { ...splits };
    newSplits[memberId] = { ...newSplits[memberId], [type]: parseFloat(value) || 0 };
    onChange(activeMethod, newSplits);
  };

  const getEqualAmount = () => {
    return members.length > 0 ? (totalAmount / members.length) : 0;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleMethodChange(method.id)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200 text-left",
              activeMethod === method.id
                ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                activeMethod === method.id 
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              )}>
                <ApperIcon name={method.icon} size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {method.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Split Configuration */}
      {activeMethod === "equal" && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Each person pays</p>
            <p className="text-2xl font-bold text-primary font-display">
              {formatAmount(getEqualAmount())}
            </p>
          </div>
        </div>
      )}

      {activeMethod === "custom" && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Set custom amounts</h4>
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.01"
                  label={member.name}
                  value={splits[member.id]?.amount || ""}
                  onChange={(e) => handleSplitChange(member.id, e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              Total assigned: {formatAmount(
                Object.values(splits).reduce((sum, split) => sum + (split.amount || 0), 0)
              )} of {formatAmount(totalAmount)}
            </p>
          </div>
        </div>
      )}

      {activeMethod === "percentage" && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Set percentage shares</h4>
          {members.map((member) => {
            const percentage = splits[member.id]?.percentage || 0;
            const amount = (totalAmount * percentage) / 100;
            
            return (
              <div key={member.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-900">{member.name}</label>
                  <span className="text-sm text-gray-500">{formatAmount(amount)}</span>
                </div>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => handleSplitChange(member.id, e.target.value, "percentage")}
                  placeholder="0"
                />
              </div>
            );
          })}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              Total percentage: {
                Object.values(splits).reduce((sum, split) => sum + (split.percentage || 0), 0)
              }%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitMethodSelector;