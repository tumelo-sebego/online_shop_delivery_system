const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const SocketService = require("../../services/socket.service");
const { isOnline } = require("../../utils/networkCheck");
const { addToQueue, processQueue } = require("../../utils/locationQueue");

// Status transition validation
const STATUS_TRANSITIONS = {
  confirmed: ["assigned"],
  assigned: ["picked_up"],
  picked_up: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

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

// Update the updateOrderStatus function
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const driverId = req.user.id;

    const order = await Order.findOne({ _id: id, driver_id: driverId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!validateStatusTransition(order.status, status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    // Handle order completion
    if (status === "delivered") {
      order.delivery_completed_at = new Date();
      await User.findByIdAndUpdate(driverId, { is_available: true });

      // Trigger completion confirmation
      SocketService.emitOrderUpdate(id, {
        type: "order_completed",
        orderId: id,
        completedAt: order.delivery_completed_at,
      });
    }

    await order.save();

    // Notify customer through WebSocket if online
    const online = await isOnline();
    if (online) {
      SocketService.emitOrderUpdate(id, {
        type: "status_update",
        status,
        orderId: id,
      });
    }

    res.status(200).json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the updateLocation function with offline support
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    const driverId = req.user.id;

    const locationData = {
      orderId: id,
      driverId,
      latitude,
      longitude,
      timestamp: new Date(),
    };

    const online = await isOnline();
    if (!online) {
      addToQueue(locationData);
      return res.status(200).json({
        message: "Location queued for update",
        isOffline: true,
      });
    }

    await Order.findOneAndUpdate(
      { _id: id, driver_id: driverId },
      {
        "driver_location.latitude": latitude,
        "driver_location.longitude": longitude,
        "driver_location.updated_at": new Date(),
      },
    );

    // Process any queued locations
    await processQueue(async (location) => {
      await Order.findOneAndUpdate(
        { _id: location.orderId, driver_id: location.driverId },
        {
          "driver_location.latitude": location.latitude,
          "driver_location.longitude": location.longitude,
          "driver_location.updated_at": location.timestamp,
        },
      );
    });

    SocketService.emitDriverLocation(id, { latitude, longitude });

    res.status(200).json({
      message: "Location updated",
      queueProcessed: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add driver availability tracking
const updateDriverAvailability = async (req, res) => {
  try {
    const { is_available } = req.body;
    const driverId = req.user.id;

    await User.findByIdAndUpdate(driverId, { is_available });

    res.status(200).json({
      message: `Driver availability updated to ${is_available}`,
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
  updateDriverAvailability,
};
