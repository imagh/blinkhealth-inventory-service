const express = require('express');
const router = express.Router();
const { createItem, updateItem, getItem, getAllItems } = require('./model');

// Create a new item
router.post('/', async (req, res) => {
  try {
    const newItem = await createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await updateItem(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get an item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await getItem(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 