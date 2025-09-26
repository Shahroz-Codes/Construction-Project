import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";

/**
 * @desc Create new product (Admin only)
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, unit, basePrice } = req.body;

    if (!name || !category || !unit || !basePrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      unit,
      basePrice,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error creating product" });
  }
};

/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "suppliers.supplier",
      "companyName rating"
    );
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error fetching products" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc Get product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "suppliers.supplier",
      "companyName rating"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product by ID error:", error.message);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

/**
 * @desc Add supplier to a product
 * @route PUT /api/products/:id/suppliers
 * @access Private (Wholesaler)
 */
export const addSupplierToProduct = async (req, res) => {
  try {
    const { price, stock, deliveryTime } = req.body;

    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only suppliers can add themselves to products" });
    }

    const supplier = await Supplier.findOne({ user: req.user._id });
    if (!supplier) return res.status(400).json({ message: "Supplier profile not found" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if supplier already exists
    const exists = product.suppliers.find(
      (s) => s.supplier.toString() === supplier._id.toString()
    );
    if (exists) {
      return res.status(400).json({ message: "Supplier already linked to this product" });
    }

    product.suppliers.push({
      supplier: supplier._id,
      price,
      stock,
      deliveryTime,
    });

    await product.save();

    res.json({
      message: "Supplier added to product",
      product: await product.populate("suppliers.supplier", "companyName rating"),
    });
  } catch (error) {
    console.error("Add supplier error:", error.message);
    res.status(500).json({ message: "Server error adding supplier to product" });
  }
};

/**
 * @desc Update supplier details for a product
 * @route PUT /api/products/:id/suppliers/update
 * @access Private (Wholesaler)
 */
export const updateSupplierForProduct = async (req, res) => {
  try {
    const { price, stock, deliveryTime, isAvailable } = req.body;

    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only suppliers can update product details" });
    }

    const supplier = await Supplier.findOne({ user: req.user._id });
    if (!supplier) return res.status(400).json({ message: "Supplier profile not found" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const supplierEntry = product.suppliers.find(
      (s) => s.supplier.toString() === supplier._id.toString()
    );
    if (!supplierEntry) {
      return res.status(400).json({ message: "Supplier not linked to product" });
    }

    // Update supplier-specific details
    if (price !== undefined) supplierEntry.price = price;
    if (stock !== undefined) supplierEntry.stock = stock;
    if (deliveryTime !== undefined) supplierEntry.deliveryTime = deliveryTime;
    if (isAvailable !== undefined) supplierEntry.isAvailable = isAvailable;

    supplierEntry.lastUpdated = new Date();

    await product.save();

    res.json({
      message: "Supplier details updated",
      product: await product.populate("suppliers.supplier", "companyName rating"),
    });
  } catch (error) {
    console.error("Update supplier error:", error.message);
    res.status(500).json({ message: "Server error updating supplier for product" });
  }
};
