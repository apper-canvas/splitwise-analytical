import React, { useState, useEffect } from "react";
import { offlineService } from "@/services/offlineService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const OfflineBanner = () => {
  const [state, setState] = useState(offlineService.getConnectionState());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineService.subscribe(setState);
    return unsubscribe;
  }, []);

  if (state.isOnline && !state.hasDrafts) {
    return null;
  }

  const handleSyncNow = async () => {
    await offlineService.forcSync();
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      state.isOnline ? "bg-gradient-to-r from-warning/90 to-warning" : "bg-gradient-to-r from-danger/90 to-danger"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {state.isOnline ? (
                  <ApperIcon 
                    name="Wifi" 
                    size={18} 
                    className="text-white" 
                  />
                ) : (
                  <ApperIcon 
                    name="WifiOff" 
                    size={18} 
                    className="text-white animate-pulse" 
                  />
                )}
                <div className="text-white">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {state.isOnline ? "Online" : "Offline"}
                    </span>
                    {state.hasDrafts && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {state.draftCount} draft{state.draftCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {!state.isOnline && (
                    <div className="text-xs text-white/90">
                      Working in offline mode
                    </div>
                  )}
                </div>
              </div>

              {state.hasDrafts && isExpanded && (
                <div className="text-xs text-white/90 ml-2">
                  {state.syncInProgress ? "Syncing drafts..." : "Drafts will sync automatically when online"}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {state.isOnline && state.hasDrafts && !state.syncInProgress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSyncNow}
                  className="text-white hover:bg-white/10 text-xs px-3 py-1 min-h-[32px]"
                >
                  <ApperIcon name="RefreshCw" size={14} className="mr-1" />
                  Sync Now
                </Button>
              )}

              {state.syncInProgress && (
                <div className="flex items-center text-white text-xs">
                  <ApperIcon name="Loader" size={14} className="mr-1 animate-spin" />
                  Syncing...
                </div>
              )}

              {state.hasDrafts && (
                <button
                  onClick={handleToggleExpanded}
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  <ApperIcon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;