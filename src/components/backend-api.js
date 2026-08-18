const express = require('express');
const cors = require('cors');
const EbayScraper = require('./ebay-scraper-service');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ebayAccessToken = process.env.EBAY_ACCESS_TOKEN;
const scraper = new EbayScraper(ebayAccessToken);

// POST /api/analyze-complete - Análisis completo + IA
app.post('/api/analyze-complete', async (req, res) => {
  try {
    const { upc, sku, purchasePrice = 0 } = req.body;
    
    const items = await scraper.searchProduct(upc, sku);
    const stats = scraper.calculateStats(items);
    const profit = scraper.calculateProfit(stats, purchasePrice);
    const opportunity = scraper.classifyOpportunity(profit.margin, stats.monthlyVolume);

    const analysis = {
      product: { upc, sku },
      marketData: stats,
      profitAnalysis: profit,
      opportunityClassification: opportunity,
      verdict: profit.margin > 20 ? 'BUY' : 'PASS',
      confidence: Math.min(stats.activeListings / 50, 1) * 100
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analyze - Análisis rápido
app.get('/api/analyze', async (req, res) => {
  try {
    const { upc, sku } = req.query;
    const items = await scraper.searchProduct(upc, sku);
    const stats = scraper.calculateStats(items);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ebay-data - Datos crudos de eBay
app.get('/api/ebay-data', async (req, res) => {
  try {
    const { upc, sku } = req.query;
    const items = await scraper.searchProduct(upc, sku);
    res.json({ items, count: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/batch-analyze - Múltiples productos
app.post('/api/batch-analyze', async (req, res) => {
  try {
    const { products } = req.body;
    const results = await Promise.all(
      products.map(async (p) => {
        const items = await scraper.searchProduct(p.upc, p.sku);
        const stats = scraper.calculateStats(items);
        return { ...p, stats };
      })
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
