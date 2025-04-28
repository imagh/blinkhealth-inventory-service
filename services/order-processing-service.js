const { updateItem, getItem } = require("../modules/items/model");
const { updateOrder, getAllOrders } = require("../modules/orders/model");

class OrderProcessingService {
  constructor(orders) {
    this.current = 0;
    this.orders = orders || [];
    this.orders = this.orders.sort((a, b) => {
      if (a.userType === b.userType) {
        return a.placedAt - b.placedAt;
      }
      return a.userType - b.userType;
    });
  }

  getNextOrder() {
    if (this.current >= this.orders.length) {
      return null;
    }
    return this.orders[this.current++];
  }

  async processOrders() {
    let map = new Map();
    try {
      let order = this.getNextOrder();
      let item = await getItem(order.itemId);
      if (item.quantity < order.quantity) {
        order.status = "rejected";
      } else {
        order.status = "processed";
      }
      // await updateOrder(order.id, { ...order });
      map.set(order.itemId, order);

      // if item is low on stock, update stock
      if (item.quantity < 20) {
        console.log("Updating Item Stock: ", item.id, { quantity: 100 });
        // await updateItem(item.id, { quantity: 100 });
      }
    } catch (err) {
      console.error(err);
    }

    let order = this.getNextOrder();
    while (order !== null) {
      try {
        let item = await getItem(order.itemId);
        if (item.quantity < order.quantity) {
          order.status = "rejected";
        } else {
          order.status = "processed";
        }
        // await updateOrder(order.id, { ...order });
        map.set(order.itemId, order);

        // if item is low on stock, update stock
        if (item.quantity < 20) {
          // await updateItem(item.id, { quantity: 100 });
          console.log("Updating Item Stock: ", item.id, { quantity: 100 });
        }

        order = this.getNextOrder();
      } catch (err) {
        console.error(err);
      }
    }

    console.log("Orders: ", map);

    return map;
  }

  static async runService() {
    const pendingOrders = await getAllOrders({ status: "pending" });
    console.log({ pendingOrders })
    const service = new OrderProcessingService(pendingOrders);
    return service.processOrders();
  }
}


// OrderProcessingService.runService();

module.exports = OrderProcessingService;