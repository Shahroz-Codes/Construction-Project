import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    unit: "",
    basePrice: "",
  });
  const [editing, setEditing] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm({ name: "", description: "", category: "", unit: "", basePrice: "" });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      console.error("Submit product error:", err.response?.data || err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      unit: product.unit,
      basePrice: product.basePrice,
    });
    setEditing(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit (e.g. kg, pcs)"
            value={form.unit}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="basePrice"
            placeholder="Base Price"
            value={form.basePrice}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Unit</th>
            <th className="p-2 text-left">Base Price</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.unit}</td>
                <td className="p-2">${p.basePrice}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 text-center" colSpan="6">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
