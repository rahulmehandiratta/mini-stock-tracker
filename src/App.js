import React, { useState, useEffect } from 'react';

function App() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockPrice, setStockPrice] = useState(null);

  const fetchStockPrice = async () => {
    try {
      const response = await fetch(`/api/stock/${selectedStock}`);
      if (response.ok) {
        const data = await response.json();
        setStockPrice(data.price);
      } else {
        console.error('Error fetching stock price:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
  };

  useEffect(() => {
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, [selectedStock]);

  return (
    <div>
      <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
        <option value="AAPL">Apple Inc.</option>
        <option value="GOOGL">Alphabet Inc.</option>
        <option value="AMZN">Amazon.com Inc.</option>
      </select>
      {stockPrice !== null ? (
        <div>
          <h2>Selected Stock: {selectedStock}</h2>
          <h3>Price: {stockPrice}</h3>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;