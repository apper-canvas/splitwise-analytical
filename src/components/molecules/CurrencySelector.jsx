import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CurrencySelector = ({ 
  className,
  value = "USD",
  onChange,
  currencies,
  exchangeRates = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currencyList = currencies || [
    { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  ];

  const selectedCurrency = currencyList.find(c => c.code === value) || currencyList[0];

  const handleSelect = (currency) => {
    onChange(currency.code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{selectedCurrency.flag}</span>
          <div className="text-left">
            <p className="font-semibold text-gray-900">
              {selectedCurrency.symbol} {selectedCurrency.code}
            </p>
            <p className="text-sm text-gray-500">{selectedCurrency.name}</p>
          </div>
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-gray-400" 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
            {currencyList.map((currency) => {
              const rate = exchangeRates[currency.code];
              return (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency)}
                  className={cn(
                    "currency-option w-full px-4 py-3 text-left flex items-center justify-between",
                    "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                    value === currency.code && "bg-gradient-to-r from-primary/10 to-primary/20"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {currency.symbol} {currency.code}
                      </p>
                      <p className="text-sm text-gray-500">{currency.name}</p>
                    </div>
                  </div>
                  {rate && rate !== 1 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        1 USD = {rate.toFixed(4)} {currency.code}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;