import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '@/services/api/expenseService';
import { groupService } from '@/services/api/groupService';
import ExpenseItem from '@/components/molecules/ExpenseItem';
import ExpenseFilters from '@/components/molecules/ExpenseFilters';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';

const ExpenseHistoryList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    groupId: '',
    category: '',
    settled: undefined,
    startDate: '',
    endDate: '',
    sortBy: 'date-desc'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadFilteredExpenses();
  }, [filters, searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [expensesData, groupsData] = await Promise.all([
        expenseService.getAll(),
        groupService.getAll()
      ]);
      setExpenses(expensesData);
      setGroups(groupsData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load expenses. Please try again.');
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredExpenses = async () => {
    try {
      const filterParams = {
        ...filters,
        query: searchQuery
      };
      
      const filteredExpenses = await expenseService.getFilteredExpenses(filterParams);
      setExpenses(filteredExpenses);
    } catch (err) {
      console.error('Error filtering expenses:', err);
      toast.error('Failed to filter expenses');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      groupId: '',
      category: '',
      settled: undefined,
      startDate: '',
      endDate: '',
      sortBy: 'date-desc'
    });
    setSearchQuery('');
    toast.success('Filters cleared');
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           filters.groupId || 
           filters.category || 
           filters.settled !== undefined || 
           filters.startDate || 
           filters.endDate ||
           filters.sortBy !== 'date-desc';
  };

const handleExpenseClick = (expense) => {
    navigate(`/expense/${expense.Id}`);
  };
  if (loading) {
    return <Loading message="Loading expense history..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInitialData} />;
  }

return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 min-h-[44px] text-sm"
          />
          <ApperIcon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

{/* Filter Toggle and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center justify-center space-x-2 min-h-[44px]",
              hasActiveFilters() && "border-primary text-primary"
            )}
          >
            <ApperIcon name="Filter" size={16} />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full ml-1">
                Active
              </span>
            )}
          </Button>
{hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800 min-h-[44px] justify-center"
            >
              <ApperIcon name="X" size={16} />
              <span className="sm:inline hidden ml-1">Clear</span>
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <ExpenseFilters
            filters={filters}
            groups={groups}
            onChange={handleFilterChange}
          />
        )}
      </div>

{/* Results Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0 bg-gray-50 p-3 rounded-lg">
        <span>
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''} found
        </span>
        <span className="font-medium">
          Total: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </span>
      </div>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <Empty
          icon="Receipt"
          title="No expenses found"
          description={hasActiveFilters() ? 
            "Try adjusting your filters to see more results." :
            "Start by adding your first expense!"
          }
action={
            <Button
              onClick={() => window.location.href = '/add-expense'}
              className="mt-4 min-h-[44px]"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Expense
            </Button>
          }
        />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.Id}
              expense={expense}
              onClick={() => handleExpenseClick(expense)}
              className="cursor-pointer hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseHistoryList;