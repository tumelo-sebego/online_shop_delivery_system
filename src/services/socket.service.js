class SocketService {
  static io;

  static initialize(ioServer) {
    this.io = ioServer;
  }

  static emitOrderUpdate(orderId, status) {
    if (this.io) {
      this.io.to(`order-${orderId}`).emit("order-update", {
        orderId,
        status,
        timestamp: new Date(),
      });
    }
  }

  static emitDriverLocation(orderId, location) {
    if (this.io) {
      this.io.to(`order-${orderId}`).emit("location-update", {
        orderId,
        location,
        timestamp: new Date(),
      });
    }
  }
}

module.exports = SocketService;
