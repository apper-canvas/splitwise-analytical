import React from "react";
import SettingsPanel from "@/components/organisms/SettingsPanel";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <SettingsPanel />
      </div>
    </div>
  );
};

export default SettingsPage;