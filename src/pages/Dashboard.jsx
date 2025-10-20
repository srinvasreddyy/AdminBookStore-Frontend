import React, { useEffect, useState } from "react";
import { CircleUser } from "lucide-react";
import { apiGet } from "../lib/api";


const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecentOrders() {
      setLoading(true);
      setError(null);
      try {
        // Fetch recent orders for admin (limit to 6)
        const resp = await apiGet('/orders/admin?limit=6');
        const docs = resp.data?.orders || [];
        if (!cancelled) setOrders(docs);
      } catch (err) {
        console.error('Failed to fetch admin orders:', err);
        if (!cancelled) setError('Failed to load recent orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecentOrders();
    return () => { cancelled = true };
  }, []);
  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-gray-200 px-6 py-3 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border-4">
              <img src="https://avatar.iran.liara.run/public" alt="Avatar" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Welcome to Admin Panel
            </h2>
            <p className="text-gray-500 text-xs">
              Have an look at all the metrics within your dashboard.
            </p>
          </div>
        </div>
        <button className="p-3 max-lg:hidden hover:bg-gray-100 rounded-full transition-colors self-end max-md:self-start">
          <CircleUser className="w-6 h-6 text-gray-400" />
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="p-8 max-md:p-4">
       

        {/* Analytics Section */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm max-md:p-4">
            <div className="flex items-center justify-between mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-2">
              <h3 className="text-xl font-bold text-gray-800">
                Recent Orders
              </h3>
              <button className="text-sm text-gray-600 flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50">
                📅 Last 30 Days
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading recent orders...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : (
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["Order ID", "Book Title", "Customer", "Date", "Price", "Status"].map((head) => (
                        <th
                          key={head}
                          className="text-left py-3 px-4 text-sm font-semibold text-gray-500"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-700 font-medium">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-gray-800">{order.books?.[0]?.title || '—'}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {order?.shippingAddress?.fullName || '—'}
                        </td>
                        <td className="py-3 px-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          ${order.total}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

       
       
      </div>
    </>
  );
};

export default Dashboard;
