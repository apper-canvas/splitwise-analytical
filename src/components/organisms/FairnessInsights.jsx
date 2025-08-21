import React, { useState, useEffect } from 'react';
import { balanceService } from '@/services/api/balanceService';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { cn } from '@/utils/cn';
import Chart from 'react-apexcharts';

const FairnessInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('contribution');

  useEffect(() => {
    loadFairnessInsights();
  }, []);

  const loadFairnessInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await balanceService.getFairnessInsights();
      setInsights(data);
    } catch (err) {
      setError('Failed to load fairness insights');
      toast.error('Failed to load fairness insights');
    } finally {
      setLoading(false);
    }
  };

  const getFairnessColor = (score) => {
    if (score > 70) return 'text-green-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFairnessLabel = (score) => {
    if (score > 70) return 'Very Fair';
    if (score > 50) return 'Fair';
    if (score > 30) return 'Needs Attention';
    return 'Unfair';
  };

  const getPatternIcon = (type) => {
    switch (type) {
      case 'over_contributor': return 'TrendingUp';
      case 'under_contributor': return 'TrendingDown';
      case 'inconsistent': return 'BarChart3';
      case 'improving': return 'ArrowUp';
      default: return 'Activity';
    }
  };

  const getPatternColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const renderChart = () => {
    if (!insights?.contributionHistory) return null;

    const chartData = {
      series: selectedMetric === 'contribution' ? [
        {
          name: 'Contributed',
          data: insights.contributionHistory.map(item => ({
            x: item.month,
            y: item.contributed
          }))
        },
        {
          name: 'Received',
          data: insights.contributionHistory.map(item => ({
            x: item.month,
            y: item.received
          }))
        }
      ] : [
        {
          name: 'Net Contribution',
          data: insights.contributionHistory.map(item => ({
            x: item.month,
            y: item.netContribution
          }))
        },
        {
          name: 'Fairness Score',
          data: insights.contributionHistory.map(item => ({
            x: item.month,
            y: item.fairnessRating
          }))
        }
      ],
      options: {
        chart: {
          type: 'area',
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: selectedMetric === 'contribution' ? ['#00897B', '#00E676'] : ['#2196F3', '#FF9800'],
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 0,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
        },
        xaxis: {
          type: 'category',
          categories: insights.contributionHistory.map(item => {
            const date = new Date(item.month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          }),
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            },
            formatter: (value) => selectedMetric === 'contribution' ? `$${value}` : `${value}`
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          fontSize: '12px',
          fontFamily: 'Inter',
          markers: { width: 8, height: 8 }
        },
        tooltip: {
          theme: 'light',
          x: { show: true },
          y: {
            formatter: (value) => selectedMetric === 'contribution' ? `$${value}` : `${value}`
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: { height: 250 },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center'
            }
          }
        }]
      }
    };

    return (
      <div className="mt-4">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={300}
        />
      </div>
    );
  };

  if (loading) return <Loading message="Loading fairness insights..." />;
  if (error) return <Error message={error} onRetry={loadFairnessInsights} />;
  if (!insights) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Fairness Score Overview */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Fairness Score</h3>
          <Badge 
            variant={insights.fairnessScore.overall > 50 ? 'success' : 'warning'}
            className="text-sm"
          >
            {getFairnessLabel(insights.fairnessScore.overall)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={cn("text-xl sm:text-2xl font-bold", getFairnessColor(insights.fairnessScore.overall))}>
              {insights.fairnessScore.overall}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Overall</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={cn("text-xl sm:text-2xl font-bold", getFairnessColor(insights.fairnessScore.consistency))}>
              {insights.fairnessScore.consistency}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Consistency</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={cn("text-xl sm:text-2xl font-bold", getFairnessColor(insights.fairnessScore.generosity))}>
              {insights.fairnessScore.generosity}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Generosity</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center">
              <ApperIcon 
                name={insights.fairnessScore.trend === 'improving' ? 'TrendingUp' : 
                      insights.fairnessScore.trend === 'declining' ? 'TrendingDown' : 'Minus'} 
                size={20}
                className={cn(
                  insights.fairnessScore.trend === 'improving' ? 'text-green-600' :
                  insights.fairnessScore.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                )}
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 capitalize">{insights.fairnessScore.trend}</div>
          </div>
        </div>
      </Card>

      {/* Contribution Chart */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Contribution Timeline</h3>
          <div className="flex space-x-2">
            <Button
              variant={selectedMetric === 'contribution' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('contribution')}
              className="text-xs sm:text-sm"
            >
              Amounts
            </Button>
            <Button
              variant={selectedMetric === 'balance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('balance')}
              className="text-xs sm:text-sm"
            >
              Balance
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              ${insights.totalContributed.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Total Contributed</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              ${insights.totalReceived.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-green-600">Total Received</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className={cn(
              "text-lg sm:text-xl font-bold",
              insights.netContribution > 0 ? 'text-purple-600' : 'text-orange-600'
            )}>
              {insights.netContribution > 0 ? '+' : ''}${insights.netContribution.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Net Balance</div>
          </div>
        </div>

        {renderChart()}
      </Card>

      {/* Patterns & Insights */}
      {insights.patterns && insights.patterns.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Contribution Patterns</h3>
          <div className="space-y-3">
            {insights.patterns.map((pattern, index) => (
              <div 
                key={index}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border",
                  getPatternColor(pattern.impact)
                )}
              >
                <div className="flex items-start space-x-3">
                  <ApperIcon 
                    name={getPatternIcon(pattern.type)} 
                    size={20} 
                    className="flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium">
                      {pattern.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge 
                        variant={pattern.severity === 'high' ? 'danger' : 'warning'}
                        className="text-xs"
                      >
                        {pattern.severity}
                      </Badge>
                      <span className="text-xs text-gray-600 capitalize">
                        {pattern.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-3 sm:p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm sm:text-base text-gray-900">
                        {rec.title}
                      </h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'default'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {rec.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm whitespace-nowrap"
                    onClick={() => toast.info(rec.action)}
                  >
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FairnessInsights;