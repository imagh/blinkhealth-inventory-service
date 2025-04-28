const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { Item } = require('../items/model');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Items',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  placedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  userType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3]]
    }
  }
}, {
  timestamps: true
});

// Define relationship with Item
Order.belongsTo(Item, { foreignKey: 'itemId' });

// Create a new order
const createOrder = async (orderData) => {
  try {
    const newOrder = await Order.create(orderData);
    return newOrder;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Update an existing order
const updateOrder = async (id, updateData) => {
  try {
    const [updatedRows, [updatedOrder]] = await Order.update(updateData, {
      where: { id },
      returning: true
    });
    
    if (updatedRows === 0) {
      return null;
    }
    
    return updatedOrder;
  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};

// Get an order by ID
const getOrder = async (id) => {
  try {
    const order = await Order.findByPk(id, {
      include: [Item]
    });
    return order;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Get all orders
const getAllOrders = async (query) => {
  try {
    const orders = await Order.findAll({
      include: [Item], where: query
    });
    return orders;
  }
  catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    await Order.sync();
    console.log('Orders table synchronized successfully.');
  } catch (error) {
    console.error('Unable to sync Orders table:', error);
    throw error;
  }
};

module.exports = {
  Order,
  createOrder,
  updateOrder,
  getOrder,
  getAllOrders,
  initDatabase
}; 