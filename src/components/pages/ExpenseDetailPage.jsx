import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService } from '@/services/api/expenseService';
import { groupService } from '@/services/api/groupService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

const ExpenseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate ID parameter before attempting to load
    if (!id) {
      console.error('No expense ID provided in URL');
      setError('Invalid expense ID. Please check the URL.');
      setLoading(false);
      return;
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      console.error('Invalid expense ID format:', id);
      setError('Invalid expense ID format. Please check the URL.');
      setLoading(false);
      return;
    }

    loadExpenseDetails();
  }, [id]);

const loadExpenseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading expense details for ID:', id);
      
      const numericId = parseInt(id, 10);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error(`Invalid expense ID: ${id}`);
      }

      const expenseData = await expenseService.getById(numericId);
      console.log('Expense data loaded:', expenseData);
      
      if (!expenseData) {
        throw new Error(`Expense not found with ID: ${id}`);
      }

      setExpense(expenseData);

      // Load group data if groupId exists
      if (expenseData?.groupId) {
        try {
          console.log('Loading group data for groupId:', expenseData.groupId);
          const groupData = await groupService.getById(expenseData.groupId);
          console.log('Group data loaded:', groupData);
          setGroup(groupData);
        } catch (groupErr) {
          console.warn('Failed to load group data:', groupErr);
          // Don't fail the entire operation if group loading fails
        }
      }

    } catch (err) {
      console.error('Error loading expense details:', err);
      const errorMessage = err.message || 'Failed to load expense details. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/history');
  };

  const handleEdit = () => {
    navigate(`/add-expense?edit=${expense.Id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      return;
    }

    try {
      await expenseService.delete(expense.Id);
      toast.success('Expense deleted successfully');
      navigate('/history');
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error('Failed to delete expense');
    }
  };

  const handleSettle = async () => {
    try {
      await expenseService.settleExpense(expense.Id);
      toast.success('Expense marked as settled');
      loadExpenseDetails(); // Reload to get updated data
    } catch (err) {
      console.error('Error settling expense:', err);
      toast.error('Failed to settle expense');
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getSplitText = (expense) => {
    if (!expense?.splitWith?.length) return 'No split';
    
    const totalParticipants = expense.splitWith.length + 1; // +1 for payer
    return `Split ${totalParticipants} ways`;
  };

if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loading message="Loading expense details..." />
        <p className="text-sm text-gray-500">Loading expense ID: {id}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Error 
          message={error} 
          onRetry={loadExpenseDetails}
          action={
            <Button onClick={handleBack} variant="outline" className="mt-4">
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to History
            </Button>
          }
        />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="max-w-2xl mx-auto">
        <Error 
          message="Expense not found" 
          onRetry={loadExpenseDetails}
          action={
            <Button onClick={handleBack} variant="outline" className="mt-4">
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to History
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ApperIcon name="ArrowLeft" size={18} />
          <span>Back</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Edit" size={16} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Expense Card */}
      <Card className="p-6">
<div className="space-y-6">
          {/* Amount and Status */}
          <div className="text-center border-b pb-6">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {formatAmount(expense?.amount || 0, expense?.currency || 'USD')}
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Badge variant={expense?.settled ? 'success' : 'warning'}>
                {expense?.settled ? 'Settled' : 'Pending'}
              </Badge>
              {expense?.category && (
                <Badge variant="outline">
                  {expense.category}
                </Badge>
              )}
            </div>
          </div>

{/* Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {expense?.description || 'Unnamed Expense'}
            </h2>
            {expense?.notes && (
              <p className="text-gray-600">{expense.notes}</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" size={16} className="text-gray-400" />
<span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {expense?.date ? format(new Date(expense.date), 'PPP') : 'No date'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="User" size={16} className="text-gray-400" />
<span className="text-gray-600">Paid by:</span>
                <div className="flex items-center space-x-2">
                  <Avatar name={expense?.paidBy || 'Unknown'} size="sm" />
                  <span className="font-medium">{expense?.paidBy || 'Unknown'}</span>
                </div>
              </div>

              {group && (
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Users" size={16} className="text-gray-400" />
                  <span className="text-gray-600">Group:</span>
                  <span className="font-medium">{group.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="DollarSign" size={16} className="text-gray-400" />
<span className="text-gray-600">Currency:</span>
                <span className="font-medium">{expense?.currency || 'USD'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <ApperIcon name="Users" size={16} className="text-gray-400" />
                <span className="text-gray-600">Split:</span>
                <span className="font-medium">{getSplitText(expense)}</span>
              </div>

              {expense.receiptImage && (
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Receipt" size={16} className="text-gray-400" />
                  <span className="text-gray-600">Receipt:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary-dark p-0"
                  >
                    View Receipt
                  </Button>
                </div>
              )}
            </div>
          </div>

{/* Split Details */}
          {expense?.splitWith && expense.splitWith.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Split Details</h3>
<div className="space-y-3">
                {expense.splitWith.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar name={person?.name || 'Unknown'} size="sm" />
                      <span className="font-medium">{person?.name || 'Unknown'}</span>
                    </div>
                    <span className="font-medium">
                      {formatAmount(person?.amount || 0, expense?.currency || 'USD')}
                    </span>
                  </div>
                ))}
                {/* Payer's share */}
<div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Avatar name={expense?.paidBy || 'Unknown'} size="sm" />
                    <span className="font-medium">{expense?.paidBy || 'Unknown'}</span>
                    <Badge variant="outline" size="sm">Payer</Badge>
                  </div>
                  <span className="font-medium">
                    {formatAmount((expense?.amount || 0) - (expense?.splitWith?.reduce((sum, p) => sum + (p?.amount || 0), 0) || 0), expense?.currency || 'USD')}
                  </span>
                </div>
              </div>
            </div>
          )}

{/* Actions */}
          {!expense?.settled && (
            <div className="border-t pt-6">
<Button
                onClick={handleSettle}
                disabled={!expense?.Id}
                className="w-full sm:w-auto"
                variant="success"
              >
                <ApperIcon name="Check" size={16} className="mr-2" />
                Mark as Settled
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpenseDetailPage;