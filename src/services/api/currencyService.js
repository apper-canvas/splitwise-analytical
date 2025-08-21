import currenciesData from "@/services/mockData/currencies.json";
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CurrencyService {
  constructor() {
    this.exchangeRates = {};
    this.lastUpdated = null;
    this.supportedCurrencies = currenciesData;
  }

  async getExchangeRates() {
    await delay(500);
    
    // Mock exchange rates (in real app, fetch from API)
    const rates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      BRL: 5.2
    };

    this.exchangeRates = rates;
    this.lastUpdated = new Date();
    return rates;
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    if (!this.exchangeRates || Object.keys(this.exchangeRates).length === 0) {
      await this.getExchangeRates();
    }

    const fromRate = this.exchangeRates[fromCurrency] || 1;
    const toRate = this.exchangeRates[toCurrency] || 1;
    
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    return Math.round(convertedAmount * 100) / 100;
  }

  async getSupportedCurrencies() {
    await delay(200);
    return this.supportedCurrencies;
  }

  async getAll() {
    try {
      return await this.getSupportedCurrencies();
    } catch (error) {
      console.error('Failed to get currencies:', error);
      throw error;
    }
  }

  async getHistoricalRates(currency, days = 7) {
    await delay(800);
    
    // Mock historical data
    const rates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate mock rate with some variation
      const baseRate = this.exchangeRates[currency] || 1;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const rate = baseRate + (baseRate * variation);
      
      rates.push({
        date: date.toISOString().split('T')[0],
        rate: Math.round(rate * 10000) / 10000
      });
    }
    
    return rates;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  async refreshRates() {
    return await this.getExchangeRates();
  }
}
// Create and export service instance
export const currencyService = new CurrencyService();

// Export individual methods for convenience
export const {
  getAll,
  getExchangeRates,
  convertCurrency,
  getSupportedCurrencies,
  getHistoricalRates,
  getLastUpdated,
  refreshRates
} = currencyService;
// Default export
export default currencyService;