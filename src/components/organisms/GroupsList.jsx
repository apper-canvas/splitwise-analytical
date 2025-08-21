import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "@/components/molecules/GroupCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { groupService } from "@/services/api/groupService";
import { balanceService } from "@/services/api/balanceService";
import { toast } from "react-toastify";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const [groupsData, allBalances] = await Promise.all([
        groupService.getAll(),
        balanceService.getAllGroupBalances()
      ]);

      setGroups(groupsData);
      setUserBalances(allBalances);
    } catch (err) {
      setError(err.message || "Failed to load groups");
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  const handleGroupClick = (group) => {
    navigate(`/groups/${group.Id}`);
  };

  const handleSettleUp = async (groupId, userBalance) => {
    try {
      await balanceService.settleGroupBalance(groupId, userBalance);
      toast.success("Balance settled successfully!");
      await loadGroups(); // Reload data
    } catch (err) {
      toast.error("Failed to settle balance");
    }
  };

  if (loading) return <Loading variant="groups" />;
  if (error) return <Error onRetry={loadGroups} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Your Groups
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your expense sharing groups
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateGroup}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Create Group</span>
        </Button>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <Empty
          icon="Users"
          title="No groups yet"
          message="Create your first group to start sharing expenses with friends and family."
          actionLabel="Create Group"
          onAction={handleCreateGroup}
        />
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Users" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 font-display">
                    {groups.length}
                  </p>
                  <p className="text-sm text-blue-700">Active Groups</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 font-display">
                    ${Object.values(userBalances)
                      .filter(balance => balance.netBalance > 0)
                      .reduce((sum, balance) => sum + balance.netBalance, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-sm text-green-700">You're Owed</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingDown" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900 font-display">
                    ${Object.values(userBalances)
                      .filter(balance => balance.netBalance < 0)
                      .reduce((sum, balance) => sum + Math.abs(balance.netBalance), 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-700">You Owe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.Id}
                group={group}
                userBalance={userBalances[group.Id]}
                onClick={() => handleGroupClick(group)}
                onSettleUp={handleSettleUp}
              />
            ))}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Group Management</h3>
            <p className="text-primary-light opacity-90 text-sm">
              Create new groups or manage existing ones
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCreateGroup}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Group
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/invite-friends")}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Invite Friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsList;