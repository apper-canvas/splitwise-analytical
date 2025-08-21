import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseHistoryList from '@/components/organisms/ExpenseHistoryList';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ExpenseHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Clock" size={24} className="text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">
                Expense History
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/add-expense')}
              className="text-primary hover:text-primary-dark"
            >
              <ApperIcon name="Plus" size={18} />
              <span className="hidden sm:inline ml-1">Add Expense</span>
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            View and filter all your expenses
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <ExpenseHistoryList />
      </div>
    </div>
  );
};

export default ExpenseHistoryPage;