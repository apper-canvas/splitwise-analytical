import React from "react";
import Dashboard from "@/components/organisms/Dashboard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;