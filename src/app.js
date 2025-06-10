const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const authRoutes = require("./routes/common/auth.routes");
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");
const driverRoutes = require("./routes/driver");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Configure according to your needs
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join-order", (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Client joined order: ${orderId}`);
  });

  socket.on("driver-location", (data) => {
    socket.to(`order-${data.orderId}`).emit("location-update", data);
    console.log(`Location update for order: ${data.orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to WeDeliver9/9 Delivery System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      customer: "/api/customer",
      driver: "/api/driver",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/driver", driverRoutes);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
