const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
} = require("../../controllers/customer/cart.controller");
const { authMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);
router.post("/", addToCart);
router.get("/", getCartItems);
router.put("/:id", updateCartItem);
router.delete("/:id", removeFromCart);

module.exports = router;
