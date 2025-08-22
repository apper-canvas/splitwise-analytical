import { toast } from "react-toastify";

class BalanceService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'balance_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getCurrentUserBalance() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "user_id_c" } },
          { field: { Name: "group_id_c" } },
          { field: { Name: "owes_c" } },
          { field: { Name: "owed_by_c" } },
          { field: { Name: "net_balance_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: ["current-user"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          userId: "current-user",
          owes: {},
          owedBy: {},
          netBalance: 0
        };
      }

      // Find the overall balance (without groupId)
      const userBalance = response.data?.find(b => !b.group_id_c) || {
        user_id_c: "current-user",
        owes_c: "{}",
        owed_by_c: "{}",
        net_balance_c: 0
      };

      return {
        userId: userBalance.user_id_c,
        owes: this.parseJsonField(userBalance.owes_c),
        owedBy: this.parseJsonField(userBalance.owed_by_c),
        netBalance: parseFloat(userBalance.net_balance_c) || 0
      };

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current user balance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        userId: "current-user",
        owes: {},
        owedBy: {},
        netBalance: 0
      };
    }
  }

  async getGroupBalance(groupId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "user_id_c" } },
          { field: { Name: "group_id_c" } },
          { field: { Name: "owes_c" } },
          { field: { Name: "owed_by_c" } },
          { field: { Name: "net_balance_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: ["current-user"]
          },
          {
            FieldName: "group_id_c",
            Operator: "EqualTo",
            Values: [parseInt(groupId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return {
          groupId: parseInt(groupId),
          userId: "current-user",
          owes: {},
          owedBy: {},
          netBalance: 0
        };
      }

      const groupBalance = response.data[0];
      return {
        groupId: parseInt(groupBalance.group_id_c),
        userId: groupBalance.user_id_c,
        owes: this.parseJsonField(groupBalance.owes_c),
        owedBy: this.parseJsonField(groupBalance.owed_by_c),
        netBalance: parseFloat(groupBalance.net_balance_c) || 0
      };

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching group balance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        groupId: parseInt(groupId),
        userId: "current-user",
        owes: {},
        owedBy: {},
        netBalance: 0
      };
    }
  }

  async getAllGroupBalances() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "user_id_c" } },
          { field: { Name: "group_id_c" } },
          { field: { Name: "owes_c" } },
          { field: { Name: "owed_by_c" } },
          { field: { Name: "net_balance_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: ["current-user"]
          },
          {
            FieldName: "group_id_c",
            Operator: "HasValue",
            Values: []
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return {};
      }

      const groupBalances = {};
      response.data?.forEach(balance => {
        if (balance.group_id_c) {
          groupBalances[balance.group_id_c] = {
            groupId: parseInt(balance.group_id_c),
            userId: balance.user_id_c,
            owes: this.parseJsonField(balance.owes_c),
            owedBy: this.parseJsonField(balance.owed_by_c),
            netBalance: parseFloat(balance.net_balance_c) || 0
          };
        }
      });
      
      return groupBalances;

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching all group balances:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {};
    }
  }

  async settleAllBalances() {
    // Mock implementation - in real app this would update all balance records
    toast.success("All balances settled!");
    return { success: true };
  }

  async settleGroupBalance(groupId, balanceData) {
    // Mock implementation - in real app this would update the specific group balance
    toast.success("Group balance settled!");
    return { success: true };
  }

  parseJsonField(jsonStr) {
    try {
      return jsonStr ? JSON.parse(jsonStr) : {};
    } catch {
      return {};
    }
  }

  // Fairness insights methods - using mock data for calculation
  async getFairnessInsights() {
    const userBalance = await this.getCurrentUserBalance();
    const contributionHistory = await this.getContributionHistory();
    
    const fairnessScore = this.calculateContributionFairness(contributionHistory);
    const patterns = this.identifyContributionPatterns(contributionHistory);
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
    const currentDate = new Date();
    const history = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      
      const baseContribution = 200 + Math.random() * 300;
      const baseReceived = 150 + Math.random() * 250;
      
      const variance = 0.3;
      const contributionVariance = (Math.random() - 0.5) * variance;
      const receivedVariance = (Math.random() - 0.5) * variance;
      
      history.push({
        month: monthKey,
        date: date.toISOString(),
        contributed: Math.round(baseContribution * (1 + contributionVariance)),
        received: Math.round(baseReceived * (1 + receivedVariance)),
        netContribution: 0,
        fairnessRating: 0
      });
    }
    
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
    
    const contributionRatio = avgReceived > 0 ? (avgContributed / avgReceived) : 1;
    const overall = Math.min(100, Math.max(0, 50 + (contributionRatio - 1) * 25));
    
    const recentMonths = contributionHistory.slice(-3);
    const earlierMonths = contributionHistory.slice(0, 3);
    const recentAvg = recentMonths.reduce((sum, r) => sum + r.netContribution, 0) / recentMonths.length;
    const earlierAvg = earlierMonths.reduce((sum, r) => sum + r.netContribution, 0) / earlierMonths.length;
    
    let trend = 'neutral';
    if (recentAvg > earlierAvg + 20) trend = 'improving';
    else if (recentAvg < earlierAvg - 20) trend = 'declining';
    
    const netContributions = contributionHistory.map(r => r.netContribution);
    const avgNet = netContributions.reduce((sum, val) => sum + val, 0) / netContributions.length;
    const variance = netContributions.reduce((sum, val) => sum + Math.pow(val - avgNet, 2), 0) / netContributions.length;
    const consistency = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / 50)));
    
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
    
    if (avgNet > 50) {
      patterns.push({
        type: 'over_contributor',
        severity: avgNet > 100 ? 'high' : 'moderate',
        description: 'You consistently pay more than your fair share',
        impact: 'positive'
      });
    }
    
    if (avgNet < -30) {
      patterns.push({
        type: 'under_contributor',
        severity: avgNet < -80 ? 'high' : 'moderate',
        description: 'You often receive more than you contribute',
        impact: 'negative'
      });
    }
    
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
    
    if (fairnessScore.overall > 70) {
      recommendations.push({
        type: 'balance',
        priority: 'medium',
        title: 'Consider asking for reimbursements',
        description: 'You\'ve been paying more than your fair share. Don\'t hesitate to ask friends to settle up.',
        action: 'Review pending balances'
      });
    }
    
    if (fairnessScore.overall < 30) {
      recommendations.push({
        type: 'contribute',
        priority: 'high',
        title: 'Settle outstanding balances',
        description: 'You owe money to friends. Settling up will improve your contribution balance.',
        action: 'Pay pending amounts'
      });
    }
    
    if (fairnessScore.consistency < 40) {
      recommendations.push({
        type: 'consistency',
        priority: 'low',
        title: 'Try to maintain consistent contributions',
        description: 'Regular contribution patterns help maintain fairness in your groups.',
        action: 'Set spending reminders'
      });
    }
    
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

const balanceService = new BalanceService();
export { balanceService };
export default balanceService;