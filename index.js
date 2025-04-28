const express = require('express');
const bodyParser = require('body-parser');
const itemsRoutes = require('./modules/items/routes');
const orderRoutes = require('./modules/orders/routes');
const { initDatabase: initDatabaseItems } = require('./modules/items/model');
const { initDatabase: initDatabaseOrders } = require('./modules/orders/model');

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Inventory Service!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabaseItems();
    await initDatabaseOrders();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 