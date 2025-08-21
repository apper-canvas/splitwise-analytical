import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const ExpenseFilters = ({ filters, groups, onChange }) => {
  const categories = [
    { value: '', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'food', label: 'Food & Dining', icon: 'Utensils' },
    { value: 'transport', label: 'Transportation', icon: 'Car' },
    { value: 'entertainment', label: 'Entertainment', icon: 'Film' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { value: 'general', label: 'General', icon: 'Package' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
    { value: 'description', label: 'Description A-Z' }
  ];

  const statusOptions = [
    { value: undefined, label: 'All' },
    { value: false, label: 'Unsettled' },
    { value: true, label: 'Settled' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const getPresetDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      default:
        return;
    }

    onChange({
      startDate: start.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    });
  };

return (
    <Card className="p-3 sm:p-4 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Group Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ApperIcon name="Users" size={16} className="mr-1" />
            Group
          </label>
          <select
            value={filters.groupId}
            onChange={(e) => handleInputChange('groupId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm min-h-[44px]"
          >
            <option value="">All Groups</option>
            {groups.map((group) => (
              <option key={group.Id} value={group.Id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ApperIcon name="Tag" size={16} className="mr-1" />
            Category
          </label>
<select
            value={filters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm min-h-[44px]"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ApperIcon name="CheckCircle" size={16} className="mr-1" />
            Status
          </label>
<select
            value={filters.settled === undefined ? '' : filters.settled.toString()}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value === 'true';
              handleInputChange('settled', value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm min-h-[44px]"
          >
            {statusOptions.map((status, index) => (
              <option 
                key={index} 
                value={status.value === undefined ? '' : status.value.toString()}
              >
                {status.label}
              </option>
            ))}
          </select>
        </div>

{/* Date Range */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ApperIcon name="Calendar" size={16} className="mr-1" />
            Date Range
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              placeholder="Start Date"
              className="flex-1 min-h-[44px]"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              placeholder="End Date"
              className="flex-1 min-h-[44px]"
            />
          </div>
          
{/* Date Presets */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: '7 Days' },
              { key: 'month', label: '1 Month' },
              { key: 'quarter', label: '3 Months' }
            ].map((preset) => (
              <Button
                key={preset.key}
                variant="ghost"
                size="sm"
                onClick={() => getPresetDateRange(preset.key)}
                className="text-xs px-2 py-1 h-auto min-h-[32px] touch-manipulation"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ApperIcon name="ArrowUpDown" size={16} className="mr-1" />
            Sort By
          </label>
<select
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm min-h-[44px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {filters.groupId && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Group: {groups.find(g => g.Id.toString() === filters.groupId)?.name}</span>
              <button onClick={() => handleInputChange('groupId', '')}>
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Category: {categories.find(c => c.value === filters.category)?.label}</span>
              <button onClick={() => handleInputChange('category', '')}>
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.settled !== undefined && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{filters.settled ? 'Settled' : 'Unsettled'}</span>
              <button onClick={() => handleInputChange('settled', undefined)}>
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {filters.startDate && filters.endDate 
                  ? `${filters.startDate} to ${filters.endDate}`
                  : filters.startDate 
                    ? `From ${filters.startDate}`
                    : `Until ${filters.endDate}`
                }
              </span>
              <button onClick={() => onChange({ startDate: '', endDate: '' })}>
                <ApperIcon name="X" size={12} />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExpenseFilters;