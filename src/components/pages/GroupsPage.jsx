import React from "react";
import GroupsList from "@/components/organisms/GroupsList";

const GroupsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <GroupsList />
      </div>
    </div>
  );
};

export default GroupsPage;