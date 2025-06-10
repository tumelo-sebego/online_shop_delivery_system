const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  assignDriver,
  autoAssignDriver,
} = require("../../controllers/admin/order.controller");

router.get("/", getAllOrders);
router.get("/:id", getOrderDetails);
router.put("/:id/status", updateOrderStatus);
router.post("/:id/assign-driver", assignDriver);
router.post("/:id/auto-assign", autoAssignDriver);

module.exports = router;
