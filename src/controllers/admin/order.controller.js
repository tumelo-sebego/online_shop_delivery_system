const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const SocketService = require("../../services/socket.service");

const getAllOrders = async (req, res) => {
  try {
    // TODO: Implement get all orders logic
    res.status(200).json({
      orders: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // TODO: Implement order status update logic
    res.status(200).json({
      message: `Order ${id} status updated to ${status}`,
      order: { id, status },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        driver_id: driverId,
        status: "assigned",
      },
      { new: true },
    );

    // Notify driver through WebSocket
    SocketService.emitOrderUpdate(id, {
      type: "assigned",
      driverId,
      orderId: id,
    });

    res.status(200).json({
      message: "Driver assigned successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autoAssignDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Find available drivers
    const availableDrivers = await User.find({
      role: "driver",
      is_active: true,
      // Add more criteria like location, current load, etc.
    });

    if (!availableDrivers.length) {
      return res.status(404).json({ error: "No available drivers" });
    }

    // Simple auto-assignment (can be made more sophisticated)
    const selectedDriver = availableDrivers[0];

    const order = await Order.findByIdAndUpdate(
      id,
      {
        driver_id: selectedDriver._id,
        status: "assigned",
      },
      { new: true },
    );

    // Notify driver through WebSocket
    SocketService.emitOrderUpdate(id, {
      type: "assigned",
      driverId: selectedDriver._id,
      orderId: id,
    });

    res.status(200).json({
      message: "Driver auto-assigned successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  assignDriver,
  autoAssignDriver,
};
