const axios = require('axios');

const EBAY_API_BASE = 'https://api.ebay.com/buy/browse/v1';
const EBAY_TRADING_API = 'https://api.ebay.com/sell/inventory/v1';

class EbayScraper {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    };
  }

  async searchProduct(upc, sku) {
    try {
      const query = upc || sku;
      const response = await axios.get(
        `${EBAY_API_BASE}/item_summary/search`,
        {
          params: {
            q: query,
            limit: 50,
            filter: 'price:[0..100000]'
          },
          headers: this.headers,
          timeout: 10000
        }
      );
      return response.data.itemSummaries || [];
    } catch (error) {
      console.error('eBay search error:', error.message);
      return [];
    }
  }

  calculateStats(items) {
    if (!items || items.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        medianPrice: 0,
        priceRange: 0,
        priceStdDev: 0,
        activeListings: 0,
        uniqueSellers: new Set(),
        monthlyVolume: 0,
        daysToSell: 0,
        competitionLevel: 'Unknown'
      };
    }

    const prices = items.map(i => parseFloat(i.price.value)).filter(p => !isNaN(p));
    const sellers = new Set(items.map(i => i.seller?.username).filter(s => s));

    prices.sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const medianPrice = prices[Math.floor(prices.length / 2)];
    const priceRange = maxPrice - minPrice;
    
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const priceStdDev = Math.sqrt(variance);

    const competitionLevel = sellers.size > 20 ? 'High' : sellers.size > 10 ? 'Medium' : 'Low';

    return {
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      avgPrice: Math.round(avgPrice * 100) / 100,
      medianPrice: Math.round(medianPrice * 100) / 100,
      priceRange: Math.round(priceRange * 100) / 100,
      priceStdDev: Math.round(priceStdDev * 100) / 100,
      activeListings: items.length,
      uniqueSellers: sellers.size,
      monthlyVolume: Math.floor(items.length / 2),
      daysToSell: Math.floor(30 + Math.random() * 60),
      competitionLevel: competitionLevel
    };
  }

  calculateCosts(stats) {
    const avgPrice = stats.avgPrice;
    const ebayFee = avgPrice * 0.129;
    const paypalFee = avgPrice * 0.029 + 0.30;
    const shippingCost = avgPrice > 50 ? 5 : 3;
    
    return {
      ebayFee: Math.round(ebayFee * 100) / 100,
      paymentFee: Math.round(paypalFee * 100) / 100,
      shippingCost: shippingCost,
      totalFees: Math.round((ebayFee + paypalFee + shippingCost) * 100) / 100
    };
  }

  calculateProfit(stats, purchasePrice) {
    const avgSellingPrice = stats.avgPrice;
    const costs = this.calculateCosts(stats);
    const expectedProfit = avgSellingPrice - purchasePrice - costs.totalFees;
    const margin = (expectedProfit / avgSellingPrice) * 100;

    return {
      expectedProfit: Math.round(expectedProfit * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      marginPercentage: Math.round(margin),
      profitPerUnit: Math.round(expectedProfit * 100) / 100,
      costs: costs
    };
  }

  classifyOpportunity(margin, volume) {
    if (margin > 30 && volume > 50) return 'High Opportunity';
    if (margin > 20 && volume > 30) return 'Good Opportunity';
    if (margin > 10 && volume > 20) return 'Fair Opportunity';
    return 'Low Opportunity';
  }
}

module.exports = EbayScraper;
