import React, { useEffect, useState } from "react";
import TripCard from "@/components/molecules/TripCard";
import { expenseService } from "@/services/api/expenseService";
import { balanceService } from "@/services/api/balanceService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import BalanceCard from "@/components/molecules/BalanceCard";
import ExpenseItem from "@/components/molecules/ExpenseItem";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [userBalance, setUserBalance] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load recent expenses, user balance, and trips
      const [expenses, balance, tripSummary] = await Promise.all([
        expenseService.getAll(),
        balanceService.getCurrentUserBalance(),
        expenseService.getTripSummary()
      ]);

      // Get the 5 most recent expenses
      const sortedExpenses = expenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentExpenses(sortedExpenses);
      setUserBalance(balance);
      setTrips(tripSummary);
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

  const handleExport = async (tripName, format) => {
    try {
      const exportData = await expenseService.exportTripData(tripName, format);
      
      if (format === 'csv') {
        // Create and download CSV file
        const blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${tripName.replace(/\s+/g, '_')}_expenses.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`CSV exported for ${tripName}!`);
      } else if (format === 'pdf') {
        // For PDF, we would typically use a library like jsPDF
        // For now, we'll show the structured data in console and notify user
        console.log('PDF Data:', exportData);
        toast.info(`PDF export for ${tripName} is being prepared...`);
        
        // Create a simple text file as PDF placeholder
        const pdfContent = `Trip: ${exportData.tripName}
Total Amount: $${exportData.totalAmount.toFixed(2)}
Number of Expenses: ${exportData.expenseCount}

Expenses:
${exportData.expenses.map(exp => 
  `${exp.date} - ${exp.description}: $${exp.amount} (${exp.category}) - Paid by ${exp.paidBy}`
).join('\n')}`;
        
        const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${tripName.replace(/\s+/g, '_')}_expenses.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Export file created for ${tripName}!`);
      }
    } catch (err) {
      toast.error(`Failed to export ${tripName} data: ${err.message}`);
    }
  };
  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error onRetry={loadDashboardData} />;

  const totalOwed = userBalance?.owedBy ? 
    Object.values(userBalance.owedBy).reduce((sum, amount) => sum + amount, 0) : 0;
  const totalOwes = userBalance?.owes ? 
    Object.values(userBalance.owes).reduce((sum, amount) => sum + amount, 0) : 0;
  const netBalance = totalOwed - totalOwes;

return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          Here's your expense summary and recent activity
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-primary-light opacity-90 text-xs sm:text-sm">
              Add expenses or settle up with friends
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddExpense}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 min-h-[44px] justify-center"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Expense
            </Button>
            {netBalance !== 0 && (
              <Button
variant="accent"
                size="sm"
                onClick={handleSettleUp}
                className="animate-pulse-subtle min-h-[44px] justify-center"
              >
                <ApperIcon name="CreditCard" size={16} className="mr-2" />
                Settle Up
              </Button>
            )}
          </div>
        </div>
      </div>
{/* Trip/Event Buckets */}
      {trips.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-display">
              Trip & Event Buckets
            </h2>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} className="mr-2" />
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.slice(0, 6).map((trip, index) => (
              <TripCard
                key={index}
                trip={trip}
                onExport={handleExport}
                className="h-full"
              />
            ))}
          </div>
          
          {trips.length > 6 && (
            <div className="mt-4 sm:mt-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/trips")}
                className="text-primary hover:text-primary-dark hover:bg-primary/5 min-h-[36px]"
              >
                View All Trips
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-display">
            Recent Expenses
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/history")}
            className="text-primary hover:text-primary-dark min-h-[36px]"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ApperIcon name="ArrowRight" size={16} className="ml-1 sm:ml-2" />
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
          <div className="space-y-3 sm:space-y-4">
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 sm:p-6 border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="TrendingUp" size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                Spending Insights
              </h3>
              <p className="text-blue-700 text-xs sm:text-sm mb-3 leading-relaxed">
                You've added {recentExpenses.length} expenses in your recent activity. 
                {netBalance > 0 && " Great job keeping track of shared costs!"}
                {netBalance < 0 && " Don't forget to settle up with your friends."}
                {netBalance === 0 && " All your accounts are balanced!"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/insights")}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 min-h-[36px] text-xs sm:text-sm"
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