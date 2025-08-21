import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = () => {
const navItems = [
    { 
      path: "/", 
      icon: "Home", 
      label: "Dashboard",
      exact: true 
    },
    { 
      path: "/add-expense", 
      icon: "Plus", 
      label: "Add",
      isAction: true 
    },
    { 
      path: "/history", 
      icon: "Clock", 
      label: "History" 
    },
    { 
      path: "/groups", 
      icon: "Users", 
      label: "Groups" 
    },
    { 
      path: "/settings", 
      icon: "Settings", 
      label: "Settings" 
    }
  ];

  return (
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200",
                item.isAction
                  ? "relative"
                  : isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              )
            }
          >
            {({ isActive }) => (
              <>
                {item.isAction ? (
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg -mt-2">
                    <ApperIcon name={item.icon} size={24} className="text-white" />
                  </div>
                ) : (
                  <>
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
                      isActive && "bg-primary/10"
                    )}>
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className={isActive ? "text-primary" : "text-gray-500"}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isActive ? "text-primary" : "text-gray-500"
                    )}>
                      {item.label}
                    </span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;