import BulkOrder from "../models/BulkOrder.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

/**
 * @desc    Create bulk order request (Customer)
 * @route   POST /api/bulkorders
 * @access  Private/Customer
 */
export const createBulkOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create bulk orders" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const bulkOrder = new BulkOrder({
      customer: req.user._id,
      product: productId,
      quantity,
    });

    await bulkOrder.save();
    res.status(201).json(bulkOrder);
  } catch (error) {
    console.error("Create bulk order error:", error.message);
    res.status(500).json({ message: "Server error creating bulk order" });
  }
};

/**
 * @desc    Get all open bulk orders (Suppliers view)
 * @route   GET /api/bulkorders/open
 * @access  Private/Supplier
 */
export const getOpenBulkOrders = async (req, res) => {
  try {
    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only suppliers can view open bulk orders" });
    }

    const orders = await BulkOrder.find({ status: "Open" }).populate("product", "name category");
    res.json(orders);
  } catch (error) {
    console.error("Get open bulk orders error:", error.message);
    res.status(500).json({ message: "Server error fetching bulk orders" });
  }
};

/**
 * @desc    Supplier submits a bid
 * @route   POST /api/bulkorders/:id/bid
 * @access  Private/Supplier
 */
export const submitBid = async (req, res) => {
  try {
    const { price, deliveryTime } = req.body;

    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only suppliers can bid" });
    }

    const supplier = await Supplier.findOne({ user: req.user._id });
    if (!supplier) return res.status(400).json({ message: "Supplier profile not found" });

    const bulkOrder = await BulkOrder.findById(req.params.id);
    if (!bulkOrder) return res.status(404).json({ message: "Bulk order not found" });
    if (bulkOrder.status === "Closed")
      return res.status(400).json({ message: "Bidding closed for this order" });

    const totalAmount = bulkOrder.quantity * price;

    bulkOrder.bids.push({
      supplier: supplier._id,
      price,
      totalAmount,
      deliveryTime,
    });

    await bulkOrder.save();
    res.json({ message: "Bid submitted successfully", bulkOrder });
  } catch (error) {
    console.error("Submit bid error:", error.message);
    res.status(500).json({ message: "Server error submitting bid" });
  }
};

/**
 * @desc    Customer selects winning bid -> Auto-create Order
 * @route   PUT /api/bulkorders/:id/select/:bidId
 * @access  Private/Customer
 */
export const selectWinningBid = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can select bids" });
    }

    const bulkOrder = await BulkOrder.findById(req.params.id).populate("product");
    if (!bulkOrder) return res.status(404).json({ message: "Bulk order not found" });

    if (bulkOrder.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this bulk order" });
    }

    const bid = bulkOrder.bids.id(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    // Mark winning & losing bids
    bulkOrder.bids.forEach((b) => {
      if (b._id.toString() === bid._id.toString()) {
        b.status = "Accepted";
        bulkOrder.winningBid = b.supplier;
      } else {
        b.status = "Rejected";
      }
    });

    bulkOrder.status = "Closed";
    await bulkOrder.save();

    // ✅ Auto-create an Order from winning bid
    const order = new Order({
      user: bulkOrder.customer,
      products: [
        {
          product: bulkOrder.product._id,
          quantity: bulkOrder.quantity,
          price: bid.price,
        },
      ],
      totalAmount: bid.totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await order.save();

    res.json({
      message: "Winning bid selected, order created",
      bulkOrder,
      order,
    });
  } catch (error) {
    console.error("Select winning bid error:", error.message);
    res.status(500).json({ message: "Server error selecting winning bid" });
  }
};
