import Order from "../models/Order.js";
import Product from "../models/product.js";

// Generate custom order number (e.g., ORD-2025-0001)
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Calculate totals & validate stock
    let totalAmount = 0;
    const orderItems = [];

    for (const i of items) {
      const product = await Product.findById(i.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${i.product}` });
      }

      if (product.stock < i.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const price = product.priceRetail; // default retail price
      const subtotal = i.qty * price;

      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        qty: i.qty,
        price,
        subtotal,
      });

      // reduce stock
      product.stock -= i.qty;
      await product.save();
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderNumber: await generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error creating order" });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my
 * @access  Private (Customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error.message);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Owner, Admin, Wholesaler)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow access only to owner or privileged roles
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "wholesaler"
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    res.status(500).json({ message: "Server error fetching order" });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin, Wholesaler)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({ message: "Order updated", order });
  } catch (error) {
    console.error("Update order error:", error.message);
    res.status(500).json({ message: "Server error updating order" });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private (Admin)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ message: "Server error fetching all orders" });
  }
};
