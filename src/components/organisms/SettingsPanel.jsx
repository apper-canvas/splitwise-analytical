import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import CurrencySelector from "@/components/molecules/CurrencySelector";
import { toast } from "react-toastify";

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    defaultCurrency: "USD",
    notifications: {
      expenses: true,
      settlements: true,
      reminders: true,
      weeklyReport: false
    },
    profile: {
      name: "John Doe",
      email: "john@example.com",
      avatar: ""
    },
    privacy: {
      shareExpenseDetails: true,
      allowGroupInvites: true
    },
    paymentMethods: [
      { id: 1, type: "paypal", email: "john@paypal.com", active: true },
      { id: 2, type: "venmo", username: "@johndoe", active: false }
    ]
  });

  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", name: "General", icon: "Settings" },
    { id: "notifications", name: "Notifications", icon: "Bell" },
    { id: "payment", name: "Payment", icon: "CreditCard" },
    { id: "privacy", name: "Privacy", icon: "Shield" },
    { id: "export", name: "Export", icon: "Download" }
  ];

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    toast.success("Settings saved successfully!");
  };

  const handleExport = (format) => {
    // Simulate data export
    toast.success(`Exporting data in ${format.toUpperCase()} format...`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange("profile", "name", e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange("profile", "email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Currency
          </label>
          <CurrencySelector
            value={settings.defaultCurrency}
            onChange={(currency) => setSettings(prev => ({ ...prev, defaultCurrency: currency }))}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </h4>
              <p className="text-sm text-gray-600">
                {key === "expenses" && "Get notified when new expenses are added"}
                {key === "settlements" && "Get notified when balances are settled"}
                {key === "reminders" && "Receive payment reminders"}
                {key === "weeklyReport" && "Receive weekly expense summaries"}
              </p>
            </div>
            <button
              onClick={() => handleSettingChange("notifications", key, !value)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                value ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  value ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
        <Button variant="outline" size="sm">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Method
        </Button>
      </div>

      <div className="space-y-4">
        {settings.paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <ApperIcon 
                  name={method.type === "paypal" ? "Wallet" : "Smartphone"} 
                  size={20} 
                  className="text-white" 
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">{method.type}</p>
                <p className="text-sm text-gray-600">
                  {method.email || method.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {method.active && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  Active
                </span>
              )}
              <Button variant="ghost" size="sm">
                <ApperIcon name="Settings" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.privacy).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">
                {key === "shareExpenseDetails" ? "Share Expense Details" : "Allow Group Invites"}
              </h4>
              <p className="text-sm text-gray-600">
                {key === "shareExpenseDetails" 
                  ? "Allow group members to see detailed expense information"
                  : "Allow friends to invite you to new groups"
                }
              </p>
            </div>
            <button
              onClick={() => handleSettingChange("privacy", key, !value)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                value ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  value ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExportSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">PDF Report</h4>
              <p className="text-sm text-green-700 mb-4">
                Export your expenses as a detailed PDF report
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("pdf")}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Table" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">CSV Data</h4>
              <p className="text-sm text-blue-700 mb-4">
                Export raw data for analysis in spreadsheet applications
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Data Export Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Exported data includes all your expense records, group information, and balance history. 
              Please keep this data secure and don't share it with unauthorized parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span className="font-medium text-sm">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <Card>
        {activeTab === "general" && renderGeneralSettings()}
        {activeTab === "notifications" && renderNotificationSettings()}
        {activeTab === "payment" && renderPaymentSettings()}
        {activeTab === "privacy" && renderPrivacySettings()}
        {activeTab === "export" && renderExportSettings()}

        {activeTab !== "export" && (
          <div className="pt-6 border-t border-gray-200 mt-8">
            <div className="flex space-x-4">
              <Button variant="primary" onClick={handleSave} className="flex-1 sm:flex-none">
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SettingsPanel;