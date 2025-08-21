import expensesData from "@/services/mockData/expenses.json";

// Simple delay function to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExpenseService {
  constructor() {
    this.expenses = [...expensesData];
  }

  async getAll() {
    await delay(300);
    return [...this.expenses];
  }

  async getById(Id) {
    await delay(200);
    const expense = this.expenses.find(e => e.Id === parseInt(Id));
    if (!expense) {
      throw new Error("Expense not found");
    }
    return { ...expense };
  }

  async getByGroupId(groupId) {
    await delay(250);
    return this.expenses.filter(e => e.groupId === parseInt(groupId));
  }

  async create(expenseData) {
    await delay(400);
    
    // Find highest existing Id and add 1
    const maxId = this.expenses.reduce((max, expense) => 
      Math.max(max, expense.Id), 0);
    
    const newExpense = {
      Id: maxId + 1,
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    
    this.expenses.push(newExpense);
    return { ...newExpense };
  }

  async update(Id, updateData) {
    await delay(350);
    
    const index = this.expenses.findIndex(e => e.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    
    this.expenses[index] = { ...this.expenses[index], ...updateData };
    return { ...this.expenses[index] };
  }

  async delete(Id) {
    await delay(200);
    
    const index = this.expenses.findIndex(e => e.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    
    this.expenses.splice(index, 1);
    return { success: true };
  }

  async settleExpense(Id) {
    await delay(300);
    return this.update(Id, { settled: true });
  }

  async getRecentExpenses(limit = 5) {
    await delay(250);
    const sorted = [...this.expenses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted.slice(0, limit);
  }

  async searchExpenses(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return this.expenses.filter(expense =>
      expense.description.toLowerCase().includes(lowercaseQuery) ||
      expense.paidBy.toLowerCase().includes(lowercaseQuery) ||
      expense.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getExpensesByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
return expenseDate >= start && expenseDate <= end;
    });
  }

  async getExpensesByCategory(category) {
    await delay(300);
    if (!category) return [...this.expenses];
    return this.expenses.filter(expense => 
      expense.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getExpensesByStatus(settled) {
    await delay(300);
    return this.expenses.filter(expense => expense.settled === settled);
  }

  async getFilteredExpenses(filters = {}) {
    await delay(400);
    let filtered = [...this.expenses];

    // Filter by group
    if (filters.groupId) {
      filtered = filtered.filter(expense => expense.groupId === parseInt(filters.groupId));
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(expense => 
        expense.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by status
    if (filters.settled !== undefined) {
      filtered = filtered.filter(expense => expense.settled === filters.settled);
    }

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate >= start && expenseDate <= end;
      });
    }

    // Search by query
    if (filters.query) {
      const lowercaseQuery = filters.query.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(lowercaseQuery) ||
        expense.paidBy.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Sort results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date-desc':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'date-asc':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'amount-desc':
            return b.amount - a.amount;
          case 'amount-asc':
            return a.amount - b.amount;
          case 'description':
            return a.description.localeCompare(b.description);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    } else {
      // Default sort by date descending
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }
}

export const expenseService = new ExpenseService();