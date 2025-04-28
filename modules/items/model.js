const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

// Create a new item
const createItem = async (itemData) => {
  try {
    const newItem = await Item.create(itemData);
    return newItem;
  } catch (error) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

// Update an existing item
const updateItem = async (id, updateData) => {
  try {
    const [updatedRows, [updatedItem]] = await Item.update(updateData, {
      where: { id },
      returning: true
    });
    
    if (updatedRows === 0) {
      return null;
    }
    
    return updatedItem;
  } catch (error) {
    throw new Error(`Error updating item: ${error.message}`);
  }
};

// Get an item by ID
const getItem = async (id) => {
  try {
    const item = await Item.findByPk(id);
    return item;
  } catch (error) {
    throw new Error(`Error fetching item: ${error.message}`);
  }
};

// Get all items
const getAllItems = async () => {
  try {
    const items = await Item.findAll();
    return items;
  } catch (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await Item.sync();
    console.log('Items table synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  Item,
  createItem,
  updateItem,
  getItem,
  getAllItems,
  initDatabase
}; 