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
}

export const expenseService = new ExpenseService();