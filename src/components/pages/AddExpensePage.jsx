import React from "react";
import AddExpenseForm from "@/components/organisms/AddExpenseForm";

const AddExpensePage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <AddExpenseForm />
      </div>
    </div>
  );
};

export default AddExpensePage;