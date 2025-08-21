import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-6 p-6", className)}>
        {/* Balance Overview Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="skeleton h-6 w-32 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="skeleton h-4 w-16 rounded"></div>
              <div className="skeleton h-8 w-24 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-20 rounded"></div>
              <div className="skeleton h-8 w-28 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-18 rounded"></div>
              <div className="skeleton h-10 w-32 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Recent Expenses Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="skeleton h-6 w-40 rounded-lg mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-48 rounded"></div>
                  <div className="skeleton h-3 w-32 rounded"></div>
                </div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "expenses") {
    return (
      <div className={cn("space-y-4 p-6", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-40 rounded"></div>
                <div className="skeleton h-4 w-24 rounded"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="skeleton h-5 w-20 rounded"></div>
                <div className="skeleton h-3 w-16 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "groups") {
    return (
      <div className={cn("space-y-4 p-6", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="skeleton h-6 w-32 rounded-lg"></div>
                <div className="skeleton h-4 w-24 rounded"></div>
              </div>
              <div className="skeleton h-6 w-20 rounded-lg"></div>
            </div>
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="skeleton w-8 h-8 rounded-full ring-2 ring-white"></div>
              ))}
            </div>
            <div className="skeleton h-10 w-full rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;