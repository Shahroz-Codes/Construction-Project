import Product from "../models/product.js";
import Supplier from "../models/Supplier.js";

/**
 * @desc    Create new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, unit, basePrice } = req.body;

    const product = new Product({
      name,
      description,
      category,
      unit,
      basePrice,
      suppliers: [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error creating product" });
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("suppliers.supplier", "companyName rating");
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
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
 * @desc    Add supplier to a product
 * @route   PUT /api/products/:id/suppliers
 * @access  Private (Wholesaler/Supplier)
 */
export const addSupplierToProduct = async (req, res) => {
  try {
    const { price, stock, deliveryTime } = req.body;

    // ensure user is wholesaler
    if (req.user.role !== "wholesaler") {
      return res.status(403).json({ message: "Only suppliers can add themselves to products" });
    }

    const supplier = await Supplier.findOne({ user: req.user._id });
    if (!supplier) return res.status(400).json({ message: "Supplier profile not found" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check if already added
    const exists = product.suppliers.find(
      (s) => s.supplier.toString() === supplier._id.toString()
    );
    if (exists) return res.status(400).json({ message: "Supplier already linked to this product" });

    product.suppliers.push({
      supplier: supplier._id,
      price,
      stock,
      deliveryTime,
    });

    await product.save();
    res.json({ message: "Supplier added to product", product });
  } catch (error) {
    console.error("Add supplier error:", error.message);
    res.status(500).json({ message: "Server error adding supplier to product" });
  }
};

/**
 * @desc    Update supplier details for a product
 * @route   PUT /api/products/:id/suppliers/update
 * @access  Private (Wholesaler)
 */
export const updateSupplierForProduct = async (req, res) => {
  try {
    const { price, stock, deliveryTime } = req.body;

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
    if (!supplierEntry) return res.status(400).json({ message: "Supplier not linked to product" });

    // update supplier-specific details
    supplierEntry.price = price ?? supplierEntry.price;
    supplierEntry.stock = stock ?? supplierEntry.stock;
    supplierEntry.deliveryTime = deliveryTime ?? supplierEntry.deliveryTime;

    await product.save();
    res.json({ message: "Supplier details updated", product });
  } catch (error) {
    console.error("Update supplier error:", error.message);
    res.status(500).json({ message: "Server error updating supplier for product" });
  }
};
