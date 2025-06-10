const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const SocketService = require("../../services/socket.service");

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (startDate && endDate) {
      query.order_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('customer_id', 'first_name last_name email')
      .populate('driver_id', 'first_name last_name')
      .sort({ order_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('customer_id driver_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Notify relevant parties through WebSocket
    SocketService.emitOrderUpdate(id, {
      type: 'status_update',
      status,
      orderId: id
    });

    // If status is "delivered", update driver availability
    if (status === 'delivered') {
      await User.findByIdAndUpdate(order.driver_id, {
        is_active: true
      });
    }

    res.status(200).json({
      message: `Order ${id} status updated to ${status}`,
      order
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
