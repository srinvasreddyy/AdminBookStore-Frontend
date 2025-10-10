import React from "react";
import { CircleUser } from "lucide-react";
const orders = [
  {
    id: "#ORD-1001",
    book: "The Alchemist",
    customer: "Ravi Kumar",
    date: "Oct 8, 2025",
    price: "19.99",
    status: "Delivered",
  },
  {
    id: "#ORD-1002",
    book: "Atomic Habits",
    customer: "Sneha Reddy",
    date: "Oct 9, 2025",
    price: "15.49",
    status: "Pending",
  },
  {
    id: "#ORD-1003",
    book: "The Psychology of Money",
    customer: "Karthik Raj",
    date: "Oct 10, 2025",
    price: "22.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-1004",
    book: "Rich Dad Poor Dad",
    customer: "Nisha Patel",
    date: "Oct 10, 2025",
    price: "18.75",
    status: "Delivered",
  },
];

const Dashboard = () => {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-50 border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center border-4 ">
              <img src="https://avatar.iran.liara.run/public"/>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Good Evening Team!
            </h2>
            <p className="text-gray-500 text-xs">
              Have an in-depth look at all the metrics within your dashboard.
            </p>
          </div>
        </div>
        <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <CircleUser className="w-6 h-6 text-gray-400" />
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl p-8  mb-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Monthly Revenue */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-sm opacity-90">Monthly Revenue</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold">$3.500</p>
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">
                  +2.4%
                </span>
              </div>
              <p className="text-sm opacity-75 mt-1">
                Previous month <span className="font-semibold">$1.7k</span>
              </p>
            </div>

            {/* Monthly Sales */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎟️</span>
                </div>
                <span className="text-sm opacity-90">Monthly Sales</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold">$6.750</p>
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">
                  +1.4%
                </span>
              </div>
              <p className="text-sm opacity-75 mt-1">
                Previous month <span className="font-semibold">$3.1k</span>
              </p>
            </div>

            {/* Total Profit */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤑</span>
                </div>
                <span className="text-sm opacity-90">Total Profit</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold">$10.900</p>
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">
                  +4.3%
                </span>
              </div>
              <p className="text-sm opacity-75 mt-1">
                Previous year <span className="font-semibold">$8.9k</span>
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <button className="text-sm text-gray-600 flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50">
                📅 Last 30 Days
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Book Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">
                      Status
                    </th>
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
                      <td className="py-3 px-4 text-gray-800">{order.book}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.customer}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{order.date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        ${order.price}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
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
            </div>
          </div>

         
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Transaction History
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              📅 Month ▼
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Recepient ▼
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Amount ▼
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Status ▼
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                    Invoice
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                    People
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <span>👨</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        Flyod Johntosan
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">Oct 8, 2025</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">
                    #INV-2025-001
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gray-800 text-white text-xs rounded-full border-2 border-white flex items-center justify-center">
                        +2
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
