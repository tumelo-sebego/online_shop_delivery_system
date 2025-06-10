const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for getting subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent_id",
});

// Index for better query performance
categorySchema.index({ name: "text" });

// Method to check if category has subcategories
categorySchema.methods.hasSubcategories = async function () {
  const count = await this.model("Category").countDocuments({
    parent_id: this._id,
  });
  return count > 0;
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
