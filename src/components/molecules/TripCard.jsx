import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TripCard = ({ 
  trip, 
  onExport, 
  className,
  ...props 
}) => {
  const handleExport = (format) => {
    if (onExport) {
      onExport(trip.name, format);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card 
      className={cn(
        "p-4 sm:p-6 bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary/30",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="MapPin" size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {trip.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {trip.expenseCount} {trip.expenseCount === 1 ? 'expense' : 'expenses'}
                </p>
              </div>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary border-primary/20 ml-2 flex-shrink-0"
          >
            <ApperIcon name="Users" size={12} className="mr-1" />
            {trip.participants.length}
          </Badge>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {formatAmount(trip.totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Categories */}
        {trip.categories.length > 0 && (
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Categories</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {trip.categories.slice(0, 3).map((category, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-300"
                >
                  {category}
                </Badge>
              ))}
              {trip.categories.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-300"
                >
                  +{trip.categories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Export Actions */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">Export data</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="text-xs px-3 py-2 h-8 bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
              >
                <ApperIcon name="FileText" size={14} className="mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="text-xs px-3 py-2 h-8 bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
              >
                <ApperIcon name="FileDown" size={14} className="mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;