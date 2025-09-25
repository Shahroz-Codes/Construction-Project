import mongoose from "mongoose";

// Order Item (subdocument schema)
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // your product model
    required: true,
  },
  name: { type: String, required: true },   // product name snapshot
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },  // unit price at order time
  subtotal: { type: Number, required: true } // qty * price
});

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderNumber: { type: String, unique: true }, // e.g., ORD2025001

    items: [orderItemSchema], // array of products with snapshots

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CreditCard", "PayPal", "Stripe", "BankTransfer"],
      default: "COD",
    },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    trackingNumber: { type: String }, // from courier/shipping
    invoiceUrl: { type: String }, // link to PDF invoice
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
