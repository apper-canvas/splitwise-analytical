import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceiptImageViewer from "@/components/molecules/ReceiptImageViewer";
import { expenseService } from "@/services/api/expenseService";
import { groupService } from "@/services/api/groupService";
import { currencyService } from "@/services/api/currencyService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CurrencySelector from "@/components/molecules/CurrencySelector";
import SplitMethodSelector from "@/components/molecules/SplitMethodSelector";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const AddExpenseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    currency: "USD",
    paidBy: "You",
    groupId: "",
    category: "general",
    receiptImage: null
  });

  const [splitMethod, setSplitMethod] = useState("equal");
  const [splits, setSplits] = useState({});
  const [groups, setGroups] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [groupsData, rates] = await Promise.all([
        groupService.getAll(),
        currencyService.getExchangeRates()
      ]);
      
      setGroups(groupsData);
      setExchangeRates(rates);
      
      // Set default group and members if available
      if (groupsData.length > 0) {
        const defaultGroup = groupsData[0];
        setFormData(prev => ({ ...prev, groupId: defaultGroup.Id.toString() }));
        setSelectedMembers(defaultGroup.members || []);
      }
    } catch (err) {
      toast.error("Failed to load groups and exchange rates");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Update selected members when group changes
    if (field === "groupId") {
      const selectedGroup = groups.find(g => g.Id.toString() === value);
      setSelectedMembers(selectedGroup?.members || []);
      setSplits({}); // Reset splits when group changes
    }
  };

  const handleSplitChange = (method, splitData) => {
    setSplitMethod(method);
    setSplits(splitData);
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsScanning(true);
      // Simulate AI OCR processing
      setTimeout(() => {
        // Mock extracted data
        const mockData = {
          description: "Restaurant Dinner",
          amount: "85.50",
          vendor: "Italian Bistro"
        };
        
        setFormData(prev => ({
          ...prev,
          description: mockData.description,
          amount: mockData.amount,
          receiptImage: URL.createObjectURL(file)
        }));
        
        setIsScanning(false);
        toast.success("Receipt scanned successfully! Details extracted.");
      }, 2000);
    }
  };

  const calculateSplits = () => {
    const amount = parseFloat(formData.amount) || 0;
    const members = selectedMembers;
    
    if (splitMethod === "equal") {
      const perPerson = amount / members.length;
      return members.map(member => ({
        userId: member.id,
        name: member.name,
        amount: perPerson
      }));
    } else if (splitMethod === "custom") {
      return members.map(member => ({
        userId: member.id,
        name: member.name,
        amount: splits[member.id]?.amount || 0
      }));
    } else if (splitMethod === "percentage") {
      return members.map(member => {
        const percentage = splits[member.id]?.percentage || 0;
        return {
          userId: member.id,
          name: member.name,
          amount: (amount * percentage) / 100
        };
      });
    }
    return [];
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!formData.groupId) {
      toast.error("Please select a group");
      return false;
    }
    if (selectedMembers.length === 0) {
      toast.error("No members selected for splitting");
      return false;
    }

    // Validate split totals
    const calculatedSplits = calculateSplits();
    const totalSplit = calculatedSplits.reduce((sum, split) => sum + split.amount, 0);
    const originalAmount = parseFloat(formData.amount);

    if (Math.abs(totalSplit - originalAmount) > 0.01) {
      toast.error("Split amounts don't add up to the total expense");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const expense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        paidBy: formData.paidBy,
        groupId: parseInt(formData.groupId),
        category: formData.category,
        splitBetween: calculateSplits(),
        splitMethod: splitMethod,
        receiptImage: formData.receiptImage,
        settled: false
      };

      await expenseService.create(expense);
      toast.success("Expense added successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "general", name: "General", icon: "Receipt" },
    { id: "food", name: "Food & Dining", icon: "Utensils" },
    { id: "transport", name: "Transportation", icon: "Car" },
    { id: "entertainment", name: "Entertainment", icon: "Film" },
    { id: "shopping", name: "Shopping", icon: "ShoppingBag" },
    { id: "utilities", name: "Utilities", icon: "Zap" }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Add New Expense
        </h1>
        <p className="text-gray-600">
          Split costs fairly with your friends and family
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Receipt Scanner */}
        <Card className="relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Camera" size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Scan Receipt (AI Powered)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a receipt and let AI extract the details automatically
            </p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleReceiptUpload}
              className="hidden"
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload">
              <Button
                type="button"
                variant="outline"
                className="relative"
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload Receipt
                  </>
                )}
              </Button>
            </label>

{formData.receiptImage && (
              <div className="mt-4">
                <div className="relative group cursor-pointer" onClick={() => setShowReceiptViewer(true)}>
                  <img
                    src={formData.receiptImage}
                    alt="Uploaded receipt"
                    className="max-w-48 max-h-32 object-cover rounded-lg mx-auto border-2 border-gray-200 transition-all duration-200 group-hover:border-primary group-hover:shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                      <ApperIcon name="ZoomIn" size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to view full size
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Basic Details */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Details
          </h3>
          
          <div className="space-y-4">
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="What was this expense for?"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => handleInputChange("currency", currency)}
                  exchangeRates={exchangeRates}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleInputChange("category", category.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.category === category.id
                        ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ApperIcon 
                        name={category.icon} 
                        size={20} 
                        className={formData.category === category.id ? "text-primary" : "text-gray-600"} 
                      />
                      <span className="text-xs font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group
              </label>
              <select
                value={formData.groupId}
                onChange={(e) => handleInputChange("groupId", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.Id} value={group.Id.toString()}>
                    {group.name} ({group.members?.length || 0} members)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Split Configuration */}
        {selectedMembers.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How should this be split?
            </h3>
            
            <SplitMethodSelector
              value={splitMethod}
              onChange={handleSplitChange}
              members={selectedMembers}
              totalAmount={parseFloat(formData.amount) || 0}
              splits={splits}
            />
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Expense
              </>
            )}
          </Button>
</div>
      </form>
      {/* Receipt Image Viewer */}
      <ReceiptImageViewer
        isOpen={showReceiptViewer}
        onClose={() => setShowReceiptViewer(false)}
        imageUrl={formData.receiptImage}
        imageName="Receipt"
      />
    </div>
};

export default AddExpenseForm;