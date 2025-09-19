import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    price: { type: Number, required: true }, // price per unit offered
    totalAmount: { type: Number, required: true }, // calculated total
    deliveryTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const bulkOrderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    bids: [bidSchema],
    winningBid: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true }
);

const BulkOrder = mongoose.model("BulkOrder", bulkOrderSchema);
export default BulkOrder;
