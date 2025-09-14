import Supplier from "../models/Supplier.js";
import User from "../models/User.js";

/**
 * @desc    Register supplier profile (for wholesaler)
 * @route   POST /api/suppliers
 * @access  Private (Wholesaler)
 */
export const registerSupplier = async (req, res) => {
  try {
    const { companyName, contactNumber, address } = req.body;

    // ensure user is wholesaler
    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only wholesalers can register as suppliers" });
    }

    const exists = await Supplier.findOne({ user: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "Supplier profile already exists" });
    }

    const supplier = new Supplier({
      user: req.user._id,
      companyName,
      contactNumber,
      address,
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    console.error("Register supplier error:", error.message);
    res.status(500).json({ message: "Server error registering supplier" });
  }
};

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Public
 */
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate("user", "name email role");
    res.json(suppliers);
  } catch (error) {
    console.error("Get suppliers error:", error.message);
    res.status(500).json({ message: "Server error fetching suppliers" });
  }
};

/**
 * @desc    Get supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Public
 */
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate("user", "name email role");
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    console.error("Get supplier by ID error:", error.message);
    res.status(500).json({ message: "Server error fetching supplier" });
  }
};

/**
 * @desc    Verify supplier (Admin only)
 * @route   PUT /api/suppliers/:id/verify
 * @access  Private (Admin)
 */
export const verifySupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    supplier.isVerified = true;
    await supplier.save();

    res.json({ message: "Supplier verified", supplier });
  } catch (error) {
    console.error("Verify supplier error:", error.message);
    res.status(500).json({ message: "Server error verifying supplier" });
  }
};

/**
 * @desc    Review a supplier (Customers)
 * @route   POST /api/suppliers/:id/review
 * @access  Private (Customer)
 */
export const reviewSupplier = async (req, res) => {
  try {
    const { rating } = req.body;

    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can review suppliers" });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // update rating
    supplier.totalReviews += 1;
    supplier.rating =
      (supplier.rating * (supplier.totalReviews - 1) + rating) / supplier.totalReviews;

    await supplier.save();

    res.json({ message: "Review added", supplier });
  } catch (error) {
    console.error("Review supplier error:", error.message);
    res.status(500).json({ message: "Server error reviewing supplier" });
  }
};
