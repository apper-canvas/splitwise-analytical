import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const GroupCard = ({ 
  className,
  group,
  userBalance,
  onClick,
  onSettleUp
}) => {
  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getBalanceStatus = () => {
    if (!userBalance || userBalance.netBalance === 0) {
      return { type: "settled", text: "All settled up", color: "success" };
    } else if (userBalance.netBalance > 0) {
      return { 
        type: "owed", 
        text: `You're owed ${formatAmount(userBalance.netBalance)}`, 
        color: "success" 
      };
    } else {
      return { 
        type: "owe", 
        text: `You owe ${formatAmount(userBalance.netBalance)}`, 
        color: "danger" 
      };
    }
  };

  const balanceStatus = getBalanceStatus();
  const canSettleUp = userBalance && userBalance.netBalance !== 0;

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Group Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-display">
              {group.name}
            </h3>
            <p className="text-sm text-gray-500">
              {group.members.length} members • {group.type}
            </p>
          </div>
          <Badge 
            variant={balanceStatus.color}
            size="sm"
          >
            {balanceStatus.type === "settled" ? (
              <ApperIcon name="CheckCircle" size={12} className="mr-1" />
            ) : balanceStatus.type === "owed" ? (
              <ApperIcon name="TrendingUp" size={12} className="mr-1" />
            ) : (
              <ApperIcon name="TrendingDown" size={12} className="mr-1" />
            )}
            {balanceStatus.text}
          </Badge>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {group.members.slice(0, 5).map((member, index) => (
              <Avatar 
                key={index}
                size="sm"
                alt={member.name}
                src={member.avatar}
                className="ring-2 ring-white"
              >
                {member.name.charAt(0)}
              </Avatar>
            ))}
            {group.members.length > 5 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 ring-2 ring-white">
                +{group.members.length - 5}
              </div>
            )}
          </div>

          {canSettleUp && (
            <Button
              variant="accent"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSettleUp(group.Id, userBalance);
              }}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="CreditCard" size={14} />
              <span>Settle Up</span>
            </Button>
          )}
        </div>

        {/* Recent Activity */}
        {group.recentActivity && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Last activity: {group.recentActivity}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GroupCard;