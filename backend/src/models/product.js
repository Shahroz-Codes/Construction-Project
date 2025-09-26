import mongoose from "mongoose";

const supplierDetailsSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    deliveryTime: { type: String, default: "Varies" },
    isAvailable: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    basePrice: { type: Number, required: true },

    suppliers: [supplierDetailsSchema],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
