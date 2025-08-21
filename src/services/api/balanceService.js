import balancesData from "@/services/mockData/balances.json";

// Utility function to simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  async getFairnessInsights() {
    await delay(400);
    
    const userBalance = await this.getCurrentUserBalance();
    const groupBalances = await this.getAllGroupBalances();
    const contributionHistory = await this.getContributionHistory();
    
    // Calculate fairness metrics
    const fairnessScore = this.calculateContributionFairness(contributionHistory);
    
    // Identify patterns
    const patterns = this.identifyContributionPatterns(contributionHistory);
    
    // Generate recommendations
    const recommendations = this.generateFairnessRecommendations(fairnessScore, patterns);
    
    return {
      fairnessScore,
      patterns,
      recommendations,
      contributionHistory,
      totalContributed: contributionHistory.reduce((sum, record) => sum + record.contributed, 0),
      totalReceived: contributionHistory.reduce((sum, record) => sum + record.received, 0),
      netContribution: contributionHistory.reduce((sum, record) => sum + (record.contributed - record.received), 0)
};
  }

  async getContributionHistory(months = 12) {
    await delay(300);
    
    // Generate contribution history data based on current balances and mock historical data
    const currentDate = new Date();
    const history = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      // Simulate historical data based on current balance patterns
      const baseContribution = 200 + Math.random() * 300;
      const baseReceived = 150 + Math.random() * 250;
      
      // Add some variance to make it realistic
      const variance = 0.3;
      const contributionVariance = (Math.random() - 0.5) * variance;
      const receivedVariance = (Math.random() - 0.5) * variance;
      
      history.push({
        month: monthKey,
        date: date.toISOString(),
        contributed: Math.round(baseContribution * (1 + contributionVariance)),
        received: Math.round(baseReceived * (1 + receivedVariance)),
        netContribution: 0, // Will be calculated
        fairnessRating: 0 // Will be calculated
      });
    }
    
    // Calculate net contribution and fairness rating
    history.forEach(record => {
      record.netContribution = record.contributed - record.received;
      record.fairnessRating = this.calculateMonthlyFairness(record.contributed, record.received);
    });
    
    return history;
  }

  calculateContributionFairness(contributionHistory) {
    if (!contributionHistory || contributionHistory.length === 0) {
      return {
        overall: 50,
        trend: 'neutral',
        consistency: 50,
        generosity: 50
      };
    }
    
    const totalContributed = contributionHistory.reduce((sum, record) => sum + record.contributed, 0);
    const totalReceived = contributionHistory.reduce((sum, record) => sum + record.received, 0);
    const avgContributed = totalContributed / contributionHistory.length;
    const avgReceived = totalReceived / contributionHistory.length;
    
    // Calculate overall fairness (50 = perfectly balanced, >50 = over-contributing, <50 = under-contributing)
    const contributionRatio = avgReceived > 0 ? (avgContributed / avgReceived) : 1;
    const overall = Math.min(100, Math.max(0, 50 + (contributionRatio - 1) * 25));
    
    // Calculate trend
    const recentMonths = contributionHistory.slice(-3);
    const earlierMonths = contributionHistory.slice(0, 3);
    const recentAvg = recentMonths.reduce((sum, r) => sum + r.netContribution, 0) / recentMonths.length;
    const earlierAvg = earlierMonths.reduce((sum, r) => sum + r.netContribution, 0) / earlierMonths.length;
    
    let trend = 'neutral';
    if (recentAvg > earlierAvg + 20) trend = 'improving';
    else if (recentAvg < earlierAvg - 20) trend = 'declining';
    
    // Calculate consistency (how stable the contributions are)
    const netContributions = contributionHistory.map(r => r.netContribution);
    const avgNet = netContributions.reduce((sum, val) => sum + val, 0) / netContributions.length;
    const variance = netContributions.reduce((sum, val) => sum + Math.pow(val - avgNet, 2), 0) / netContributions.length;
    const consistency = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / 50)));
    
    // Calculate generosity (how often they pay more than their share)
    const generousMonths = contributionHistory.filter(r => r.netContribution > 10).length;
    const generosity = (generousMonths / contributionHistory.length) * 100;
    
    return {
      overall: Math.round(overall),
      trend,
      consistency: Math.round(consistency),
      generosity: Math.round(generosity)
    };
  }

  calculateMonthlyFairness(contributed, received) {
    if (received === 0) return contributed > 0 ? 100 : 50;
    const ratio = contributed / received;
    return Math.min(100, Math.max(0, 50 + (ratio - 1) * 25));
  }

  identifyContributionPatterns(contributionHistory) {
    const patterns = [];
    
    if (!contributionHistory || contributionHistory.length === 0) {
      return patterns;
    }
    
    const avgNet = contributionHistory.reduce((sum, r) => sum + r.netContribution, 0) / contributionHistory.length;
    
    // Over-contributor pattern
    if (avgNet > 50) {
      patterns.push({
        type: 'over_contributor',
        severity: avgNet > 100 ? 'high' : 'moderate',
        description: 'You consistently pay more than your fair share',
        impact: 'positive'
      });
    }
    
    // Under-contributor pattern
    if (avgNet < -30) {
      patterns.push({
        type: 'under_contributor',
        severity: avgNet < -80 ? 'high' : 'moderate',
        description: 'You often receive more than you contribute',
        impact: 'negative'
      });
    }
    
    // Inconsistency pattern
    const netContributions = contributionHistory.map(r => r.netContribution);
    const variance = netContributions.reduce((sum, val) => sum + Math.pow(val - avgNet, 2), 0) / netContributions.length;
    if (Math.sqrt(variance) > 100) {
      patterns.push({
        type: 'inconsistent',
        severity: 'moderate',
        description: 'Your contribution patterns vary significantly month to month',
        impact: 'neutral'
      });
    }
    
    // Recent improvement pattern
    const recentMonths = contributionHistory.slice(-2);
    const recentAvg = recentMonths.reduce((sum, r) => sum + r.netContribution, 0) / recentMonths.length;
    if (recentAvg > avgNet + 30) {
      patterns.push({
        type: 'improving',
        severity: 'positive',
        description: 'Your contribution balance has improved recently',
        impact: 'positive'
      });
    }
    
    return patterns;
  }

  generateFairnessRecommendations(fairnessScore, patterns) {
    const recommendations = [];
    
    // Over-contributor recommendations
    if (fairnessScore.overall > 70) {
      recommendations.push({
        type: 'balance',
        priority: 'medium',
        title: 'Consider asking for reimbursements',
        description: 'You\'ve been paying more than your fair share. Don\'t hesitate to ask friends to settle up.',
        action: 'Review pending balances'
      });
    }
    
    // Under-contributor recommendations
    if (fairnessScore.overall < 30) {
      recommendations.push({
        type: 'contribute',
        priority: 'high',
        title: 'Settle outstanding balances',
        description: 'You owe money to friends. Settling up will improve your contribution balance.',
        action: 'Pay pending amounts'
      });
    }
    
    // Consistency recommendations
    if (fairnessScore.consistency < 40) {
      recommendations.push({
        type: 'consistency',
        priority: 'low',
        title: 'Try to maintain consistent contributions',
        description: 'Regular contribution patterns help maintain fairness in your groups.',
        action: 'Set spending reminders'
      });
    }
    
    // Trend-based recommendations
    if (fairnessScore.trend === 'declining') {
      recommendations.push({
        type: 'trend',
        priority: 'medium',
        title: 'Your contribution balance is declining',
        description: 'Consider being more proactive about paying for shared expenses.',
        action: 'Volunteer to pay more often'
      });
    }
    
return recommendations;
  }
}

// Create and export service instance
const balanceService = new BalanceService();
export { balanceService };
export default balanceService;