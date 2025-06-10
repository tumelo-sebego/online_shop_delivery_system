const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    delivery_fee: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "assigned",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    delivery_address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    payment_method: {
      type: String,
      enum: ["credit_card", "cash", "mobile_money"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    delivery_date: {
      type: Date,
    },
    special_instructions: {
      type: String,
      trim: true,
    },
    driver_location: {
      latitude: Number,
      longitude: Number,
      updated_at: Date,
    },
    delivery_completed_at: Date,
    offline_updates: [
      {
        type: {
          latitude: Number,
          longitude: Number,
          timestamp: Date,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

// Indexes for better query performance
orderSchema.index({ customer_id: 1, order_date: -1 });
orderSchema.index({ driver_id: 1, status: 1 });
orderSchema.index({ status: 1 });

// Virtual for getting total with delivery fee
orderSchema.virtual("final_total").get(function () {
  return this.total_amount + this.delivery_fee;
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
