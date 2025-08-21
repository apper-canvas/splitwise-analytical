import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import CurrencySelector from "@/components/molecules/CurrencySelector";
import { groupService } from "@/services/api/groupService";
import { currencyService } from "@/services/api/currencyService";
import { toast } from "react-toastify";

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  
  // Form state
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [members, setMembers] = useState([
    { name: "", email: "", isOwner: true } // First member is the owner
  ]);

  // Form validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const currenciesData = await currencyService.getAll();
      setCurrencies(currenciesData);
    } catch (err) {
      console.error("Failed to load currencies:", err);
      toast.error("Failed to load currencies");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate members
    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}_name`] = "Member name is required";
      }
      if (!member.email.trim()) {
        newErrors[`member_${index}_email`] = "Member email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member_${index}_email`] = "Invalid email format";
      }
    });

    // Check for duplicate emails
    const emails = members.map(m => m.email.toLowerCase().trim()).filter(Boolean);
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicateEmails.length > 0) {
      newErrors.duplicateEmails = "Duplicate email addresses are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    setMembers([...members, { name: "", email: "", isOwner: false }]);
  };

  const removeMember = (index) => {
    if (members.length > 1 && !members[index].isOwner) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
    
    // Clear specific field errors
    const newErrors = { ...errors };
    delete newErrors[`member_${index}_${field}`];
    delete newErrors.duplicateEmails;
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    
    try {
      const groupData = {
        name: groupName.trim(),
        description: description.trim(),
        currency: selectedCurrency,
        members: members.map(member => ({
          name: member.name.trim(),
          email: member.email.trim().toLowerCase(),
          isOwner: member.isOwner || false
        })),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      await groupService.create(groupData);
      toast.success("Group created successfully!");
      navigate("/groups");
    } catch (err) {
      toast.error(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/groups");
  };

  if (loading) return <Loading variant="form" />;

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Create New Group
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Set up a new expense sharing group with your friends
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Details Card */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Users" size={20} className="mr-2 text-primary" />
              Group Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <Input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    const newErrors = { ...errors };
                    delete newErrors.groupName;
                    setErrors(newErrors);
                  }}
                  placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
                  className={errors.groupName ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.groupName && (
                  <p className="text-red-500 text-xs mt-1">{errors.groupName}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    const newErrors = { ...errors };
                    delete newErrors.description;
                    setErrors(newErrors);
                  }}
                  placeholder="Describe what this group is for..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${
                    errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <CurrencySelector
                  value={selectedCurrency}
                  onChange={setSelectedCurrency}
                  currencies={currencies}
                />
              </div>
            </div>
          </Card>

          {/* Members Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="UserPlus" size={20} className="mr-2 text-primary" />
                Group Members
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
                className="flex items-center space-x-1"
              >
                <ApperIcon name="Plus" size={14} />
                <span>Add Member</span>
              </Button>
            </div>

            {errors.duplicateEmails && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.duplicateEmails}</p>
              </div>
            )}

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, "name", e.target.value)}
                        placeholder="Full Name"
                        className={errors[`member_${index}_name`] ? "border-red-500" : ""}
                      />
                      {errors[`member_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`member_${index}_name`]}</p>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, "email", e.target.value)}
                        placeholder="Email Address"
                        className={errors[`member_${index}_email`] ? "border-red-500" : ""}
                      />
                      {errors[`member_${index}_email`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`member_${index}_email`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start space-x-2">
                    {member.isOwner && (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                        Owner
                      </span>
                    )}
                    
                    {!member.isOwner && members.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * The first member is automatically set as the group owner. You can add more members now or invite them later.
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 sm:flex-initial min-h-[44px] justify-center"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1 sm:flex-initial min-h-[44px] justify-center"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" size={16} />
                  <span>Create Group</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;