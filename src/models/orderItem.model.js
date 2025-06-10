const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

// Index for better query performance
orderItemSchema.index({ order_id: 1 });
orderItemSchema.index({ product_id: 1 });

// Pre-save middleware to calculate total_price
orderItemSchema.pre("save", function (next) {
  this.total_price = this.quantity * this.unit_price;
  next();
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
