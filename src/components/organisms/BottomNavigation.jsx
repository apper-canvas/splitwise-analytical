import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import LogoutButton from "@/components/molecules/LogoutButton";

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
      <div className="grid grid-cols-5 h-16 sm:h-18">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200 min-h-[44px] px-1",
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
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg -mt-1 sm:-mt-2">
                    <ApperIcon name={item.icon} size={22} className="text-white sm:w-6 sm:h-6" />
                  </div>
                ) : (
                  <>
                    <div className={cn(
                      "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all duration-200 touch-manipulation",
                      isActive && "bg-primary/10"
                    )}>
                      <ApperIcon 
                        name={item.icon} 
                        size={18} 
                        className={`${isActive ? "text-primary" : "text-gray-500"} sm:w-5 sm:h-5`}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium leading-tight",
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
        
        {/* Logout Button */}
        <div className="fixed top-4 right-4 z-50">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;