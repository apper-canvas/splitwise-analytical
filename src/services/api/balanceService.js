import balancesData from "@/services/mockData/balances.json";

// Simple delay function to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BalanceService {
  constructor() {
    this.balances = [...balancesData];
  }

  async getCurrentUserBalance() {
    await delay(250);
    const userBalance = this.balances.find(b => b.userId === "current-user");
    if (!userBalance) {
      return {
        userId: "current-user",
        owes: {},
        owedBy: {},
        netBalance: 0
      };
    }
    return { ...userBalance };
  }

  async getGroupBalance(groupId) {
    await delay(200);
    const groupBalance = this.balances.find(b => b.groupId === parseInt(groupId));
    if (!groupBalance) {
      return {
        groupId: parseInt(groupId),
        userId: "current-user",
        owes: {},
        owedBy: {},
        netBalance: 0
      };
    }
    return { ...groupBalance };
  }

  async getAllGroupBalances() {
    await delay(300);
    const groupBalances = {};
    
    this.balances
      .filter(b => b.groupId)
      .forEach(balance => {
        groupBalances[balance.groupId] = { ...balance };
      });
    
    return groupBalances;
  }

  async updateBalance(userId, balanceData) {
    await delay(300);
    
    const index = this.balances.findIndex(b => b.userId === userId);
    if (index === -1) {
      // Create new balance record
      const newBalance = {
        userId,
        ...balanceData
      };
      this.balances.push(newBalance);
      return { ...newBalance };
    }
    
    this.balances[index] = { ...this.balances[index], ...balanceData };
    return { ...this.balances[index] };
  }

  async settleAllBalances() {
    await delay(500);
    
    // Reset current user's balance
    const userBalance = await this.getCurrentUserBalance();
    const clearedBalance = {
      ...userBalance,
      owes: {},
      owedBy: {},
      netBalance: 0
    };
    
    return this.updateBalance("current-user", clearedBalance);
  }

  async settleGroupBalance(groupId, balanceData) {
    await delay(400);
    
    const index = this.balances.findIndex(b => 
      b.groupId === parseInt(groupId) && b.userId === "current-user"
    );
    
    if (index !== -1) {
      this.balances[index] = {
        ...this.balances[index],
        owes: {},
        owedBy: {},
        netBalance: 0
      };
    }
    
    // Also update the overall user balance
    await this.updateUserBalanceFromGroups();
    
    return { success: true };
  }

  async settleWithPerson(personName, amount) {
    await delay(350);
    
    const userBalance = await this.getCurrentUserBalance();
    const updatedBalance = { ...userBalance };
    
    if (updatedBalance.owes[personName]) {
      delete updatedBalance.owes[personName];
    }
    
    if (updatedBalance.owedBy[personName]) {
      delete updatedBalance.owedBy[personName];
    }
    
    // Recalculate net balance
    const totalOwed = Object.values(updatedBalance.owedBy).reduce((sum, amt) => sum + amt, 0);
    const totalOwes = Object.values(updatedBalance.owes).reduce((sum, amt) => sum + amt, 0);
    updatedBalance.netBalance = totalOwed - totalOwes;
    
    return this.updateBalance("current-user", updatedBalance);
  }

  async updateUserBalanceFromGroups() {
    await delay(200);
    
    const groupBalances = this.balances.filter(b => b.groupId);
    const consolidatedBalance = {
      userId: "current-user",
      owes: {},
      owedBy: {},
      netBalance: 0
    };
    
    // Consolidate all group balances
    groupBalances.forEach(balance => {
      Object.entries(balance.owes || {}).forEach(([person, amount]) => {
        consolidatedBalance.owes[person] = (consolidatedBalance.owes[person] || 0) + amount;
      });
      
      Object.entries(balance.owedBy || {}).forEach(([person, amount]) => {
        consolidatedBalance.owedBy[person] = (consolidatedBalance.owedBy[person] || 0) + amount;
      });
    });
    
    // Calculate net balance
    const totalOwed = Object.values(consolidatedBalance.owedBy).reduce((sum, amt) => sum + amt, 0);
    const totalOwes = Object.values(consolidatedBalance.owes).reduce((sum, amt) => sum + amt, 0);
    consolidatedBalance.netBalance = totalOwed - totalOwes;
    
    return this.updateBalance("current-user", consolidatedBalance);
  }

  async getBalanceSummary() {
    await delay(300);
    
    const userBalance = await this.getCurrentUserBalance();
    const totalOwed = Object.values(userBalance.owedBy).reduce((sum, amt) => sum + amt, 0);
    const totalOwes = Object.values(userBalance.owes).reduce((sum, amt) => sum + amt, 0);
    
    return {
      totalOwed,
      totalOwes,
      netBalance: userBalance.netBalance,
      numberOfCreditors: Object.keys(userBalance.owes).length,
      numberOfDebtors: Object.keys(userBalance.owedBy).length
    };
  }
}

export const balanceService = new BalanceService();