import React, { useState, useEffect } from "react";
import BalanceCard from "@/components/molecules/BalanceCard";
import ExpenseItem from "@/components/molecules/ExpenseItem";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { expenseService } from "@/services/api/expenseService";
import { balanceService } from "@/services/api/balanceService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load recent expenses and user balance
      const [expenses, balance] = await Promise.all([
        expenseService.getAll(),
        balanceService.getCurrentUserBalance()
      ]);

      // Get the 5 most recent expenses
      const sortedExpenses = expenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentExpenses(sortedExpenses);
      setUserBalance(balance);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSettleUp = async () => {
    try {
      await balanceService.settleAllBalances();
      toast.success("All balances settled successfully!");
      await loadDashboardData(); // Reload data
    } catch (err) {
      toast.error("Failed to settle balances");
    }
  };

  const handleAddExpense = () => {
    navigate("/add-expense");
  };

  const handleViewExpense = (expense) => {
    navigate(`/expenses/${expense.Id}`);
  };

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error onRetry={loadDashboardData} />;

  const totalOwed = userBalance?.owedBy ? 
    Object.values(userBalance.owedBy).reduce((sum, amount) => sum + amount, 0) : 0;
  const totalOwes = userBalance?.owes ? 
    Object.values(userBalance.owes).reduce((sum, amount) => sum + amount, 0) : 0;
  const netBalance = totalOwed - totalOwes;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's your expense summary and recent activity
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BalanceCard
          title="You're owed"
          amount={totalOwed}
          type="owed"
          icon="TrendingUp"
          subtitle={`From ${Object.keys(userBalance?.owedBy || {}).length} people`}
        />
        <BalanceCard
          title="You owe"
          amount={totalOwes}
          type="owe"
          icon="TrendingDown"
          subtitle={`To ${Object.keys(userBalance?.owes || {}).length} people`}
        />
        <BalanceCard
          title="Net Balance"
          amount={netBalance}
          type={netBalance > 0 ? "owed" : netBalance < 0 ? "owe" : "settled"}
          icon="DollarSign"
          subtitle={
            netBalance === 0 ? "All settled up!" : 
            netBalance > 0 ? "You're in the positive" : 
            "You need to settle up"
          }
          onClick={netBalance !== 0 ? handleSettleUp : undefined}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-primary-light opacity-90 text-sm">
              Add expenses or settle up with friends
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddExpense}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Expense
            </Button>
            {netBalance !== 0 && (
              <Button
                variant="accent"
                size="sm"
                onClick={handleSettleUp}
                className="animate-pulse-subtle"
              >
                <ApperIcon name="CreditCard" size={16} className="mr-2" />
                Settle Up
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Recent Expenses
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/expenses")}
            className="text-primary hover:text-primary-dark"
          >
            View All
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>

        {recentExpenses.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No expenses yet"
            message="Start tracking your shared expenses by adding your first expense."
            actionLabel="Add First Expense"
            onAction={handleAddExpense}
          />
        ) : (
          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <ExpenseItem
                key={expense.Id}
                expense={expense}
                onClick={() => handleViewExpense(expense)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Insights Card */}
      {recentExpenses.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Spending Insights
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                You've added {recentExpenses.length} expenses in your recent activity. 
                {netBalance > 0 && " Great job keeping track of shared costs!"}
                {netBalance < 0 && " Don't forget to settle up with your friends."}
                {netBalance === 0 && " All your accounts are balanced!"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/insights")}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                View Detailed Insights
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;