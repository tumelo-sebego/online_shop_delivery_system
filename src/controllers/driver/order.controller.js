const SocketService = require("../../services/socket.service");

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "confirmed",
      driver_id: null,
    })
      .populate("customer_id", "first_name last_name")
      .populate({
        path: "items.product_id",
        select: "name",
      })
      .select("delivery_address total_amount order_date");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = req.user.id; // From auth middleware

    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        status: "confirmed",
        driver_id: null,
      },
      {
        driver_id: driverId,
        status: "assigned",
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not available" });
    }

    // Notify customer through WebSocket
    SocketService.emitOrderUpdate(id, {
      type: "driver_assigned",
      driverId,
      orderId: id,
    });

    res.status(200).json({
      message: "Order accepted successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update order status in database
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    // Emit status update through WebSocket
    SocketService.emitOrderUpdate(id, status);

    res.status(200).json({
      message: `Order ${id} status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    // Emit location update through WebSocket
    SocketService.emitDriverLocation(id, { latitude, longitude });

    res.status(200).json({
      message: `Location updated for order ${id}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveDeliveries = async (req, res) => {
  try {
    // TODO: Implement active deliveries logic
    res.status(200).json({
      deliveries: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableOrders,
  acceptOrder,
  updateOrderStatus,
  updateLocation,
  getActiveDeliveries,
};
