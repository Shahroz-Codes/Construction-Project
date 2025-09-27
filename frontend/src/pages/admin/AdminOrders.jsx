import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch orders on load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders"); // Admin only route
      setOrders(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  const handlePaymentChange = async (id, newPaymentStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { paymentStatus: newPaymentStatus });
      fetchOrders();
    } catch (err) {
      console.error("Update payment error:", err);
      alert("Failed to update payment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full bg-white shadow rounded text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Order #</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-2">{o.orderNumber}</td>
                  <td className="p-2">
                    {o.user?.name} <br />
                    <span className="text-gray-500 text-xs">{o.user?.email}</span>
                  </td>
                  <td className="p-2">
                    {o.items.map((i) => (
                      <div key={i._id}>
                        {i.name} x {i.qty} (${i.price})
                      </div>
                    ))}
                  </td>
                  <td className="p-2 font-semibold">${o.totalAmount}</td>
                  <td className="p-2">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => handlePaymentChange(o._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option>Pending</option>
                      <option>Paid</option>
                      <option>Failed</option>
                    </select>
                  </td>
                  <td className="p-2">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => alert(JSON.stringify(o, null, 2))}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
