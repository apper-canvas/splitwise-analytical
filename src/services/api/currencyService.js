import currenciesData from "@/services/mockData/currencies.json";

// Simple delay function to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CurrencyService {
  constructor() {
    this.exchangeRates = { ...currenciesData };
    this.lastUpdated = new Date();
  }

  async getExchangeRates() {
    await delay(200);
    
    // Simulate rate fluctuation (small random changes)
    const fluctuatedRates = { ...this.exchangeRates };
    Object.keys(fluctuatedRates).forEach(currency => {
      if (currency !== "USD") {
        const rate = fluctuatedRates[currency];
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
        fluctuatedRates[currency] = Math.max(0.01, rate + (rate * fluctuation));
      }
    });
    
    this.exchangeRates = fluctuatedRates;
    this.lastUpdated = new Date();
    
    return { ...this.exchangeRates };
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    await delay(150);
    
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    const rates = await this.getExchangeRates();
    
    // Convert to USD first, then to target currency
    const usdAmount = fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
    const convertedAmount = toCurrency === "USD" ? usdAmount : usdAmount * rates[toCurrency];
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  }

  async getSupportedCurrencies() {
    await delay(100);
    
    const currencyDetails = {
      USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
      EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
      GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
      INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
      JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
      CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
      AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
      CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
      CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
      SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" }
    };
    
    return Object.keys(this.exchangeRates).map(code => ({
      code,
      ...currencyDetails[code],
      rate: this.exchangeRates[code]
    }));
  }

  async getHistoricalRates(currency, days = 7) {
    await delay(300);
    
    // Simulate historical data
    const historicalRates = [];
    const currentRate = this.exchangeRates[currency];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate simulated historical rate with some variation
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
      const rate = Math.max(0.01, currentRate + (currentRate * variation));
      
      historicalRates.push({
        date: date.toISOString().split("T")[0],
        rate: Math.round(rate * 10000) / 10000
      });
    }
    
    return historicalRates;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  async refreshRates() {
    await delay(500);
    return this.getExchangeRates();
  }
}

export const currencyService = new CurrencyService();