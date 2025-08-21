import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import OfflineBanner from "@/components/molecules/OfflineBanner";
import DashboardPage from "@/components/pages/DashboardPage";
import AddExpensePage from "@/components/pages/AddExpensePage";
import ExpenseHistoryPage from "@/components/pages/ExpenseHistoryPage";
import GroupsPage from "@/components/pages/GroupsPage";
import CreateGroupPage from "@/components/pages/CreateGroupPage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Offline Status Banner */}
        <OfflineBanner />
        
        {/* Main Content */}
        <main className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-12">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
<Route path="/history" element={<ExpenseHistoryPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/create-group" element={<CreateGroupPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: "14px",
            borderRadius: "12px"
          }}
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;