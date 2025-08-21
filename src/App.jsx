import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import DashboardPage from "@/components/pages/DashboardPage";
import AddExpensePage from "@/components/pages/AddExpensePage";
import ExpenseHistoryPage from "@/components/pages/ExpenseHistoryPage";
import GroupsPage from "@/components/pages/GroupsPage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="pb-16">
<Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
            <Route path="/history" element={<ExpenseHistoryPage />} />
            <Route path="/groups" element={<GroupsPage />} />
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