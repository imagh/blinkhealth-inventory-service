const express = require('express');
const router = express.Router();
const { createOrder, updateOrder, getOrder, getAllOrders } = require('./model');
const { getItem } = require('../items/model');
const OrderProcessingService = require('../../services/order-processing-service');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { itemId, quantity, userType } = req.body;

    // Validate required fields
    if (!itemId || !quantity) {
      return res.status(400).json({ error: 'itemId and quantity are required' });
    }

    // Get item details to calculate amount
    const item = await getItem(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate total amount
    const amount = item.price * quantity;

    // Create order with calculated and default values
    const orderData = {
      itemId,
      quantity,
      amount,
      placedAt: new Date(),
      status: 'pending',
      userType  // Default user type
    };

    const newOrder = await createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/processOrders", async (req, res) => {
  let result = await OrderProcessingService.runService();

  return res.json(Array.from(result.values()));
});


module.exports = router;