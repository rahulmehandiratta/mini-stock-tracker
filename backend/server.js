const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB (you should replace 'your-mongodb-connection-string' with your actual connection string)
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

const Stock = mongoose.model('Stock', new mongoose.Schema({
  symbol: String,
  price: Number,
}));

// Define a list of predefined stocks and their initial prices (you can add more)
const predefinedStocks = [
  { symbol: 'AAPL', price: 150.5 },
  { symbol: 'GOOGL', price: 2700.75 },
  { symbol: 'AMZN', price: 3400.0 },
];

// Create or update the stock data in the database
const updateStockData = async () => {
  for (const stock of predefinedStocks) {
    await Stock.findOneAndUpdate({ symbol: stock.symbol }, stock, { upsert: true });
  }
};

updateStockData(); // Initialize stock data

// API endpoint to get the current price of a selected stock
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json({ symbol: stock.symbol, price: stock.price });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
