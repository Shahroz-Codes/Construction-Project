import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true }, // e.g., Cement, Steel, Bricks
    unit: { type: String, required: true }, // e.g., kg, bag, ton
    basePrice: { type: Number, required: true }, // reference price (not supplier specific)

    suppliers: [
      {
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supplier",
        },
        price: { type: Number, required: true }, // supplier-specific price
        stock: { type: Number, default: 0 }, // supplier-specific stock
        deliveryTime: { type: String, default: "Varies" }, // optional
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
