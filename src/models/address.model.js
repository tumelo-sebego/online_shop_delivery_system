const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address_line_1: {
      type: String,
      required: true,
      trim: true,
    },
    address_line_2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

// Ensure only one default address per customer
addressSchema.pre("save", async function (next) {
  if (this.is_default) {
    await this.constructor.updateMany(
      { customer_id: this.customer_id, _id: { $ne: this._id } },
      { $set: { is_default: false } },
    );
  }
  next();
});

// Indexes for better query performance
addressSchema.index({ customer_id: 1, is_default: 1 });
addressSchema.index({ coordinates: "2dsphere" });

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
