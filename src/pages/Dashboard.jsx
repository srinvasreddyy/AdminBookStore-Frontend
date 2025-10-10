import React from 'react'
import { CircleUser } from 'lucide-react'

const Dashboard = () => {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b sticky top-0 z-50 border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center border-4 border-neutral-200">
              <span className="text-xl">👨</span>
            </div>
            
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Good Evening Team!</h2>
            <p className="text-gray-500 text-xs">Have an in-depth look at all the metrics within your dashboard.</p>
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
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">+2.4%</span>
              </div>
              <p className="text-sm opacity-75 mt-1">Previous month <span className="font-semibold">$1.7k</span></p>
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
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">+1.4%</span>
              </div>
              <p className="text-sm opacity-75 mt-1">Previous month <span className="font-semibold">$3.1k</span></p>
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
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold">+4.3%</span>
              </div>
              <p className="text-sm opacity-75 mt-1">Previous year <span className="font-semibold">$8.9k</span></p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Total Sales & Cost */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Total Sales & Cost</h3>
            <p className="text-sm text-gray-500 mb-6">Last 60 days</p>
            <div className="mb-4">
              <p className="text-4xl font-bold text-indigo-600 mb-1">$956.82k</p>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                ↗ +5.4%
              </span>
              <p className="text-sm text-green-600 mt-1">+8.20k vs prev. 60 days</p>
            </div>
            <div className="h-48 flex items-end gap-4 mt-6">
              <div className="flex-1 bg-indigo-200 rounded-t-lg" style={{height: '50%'}}></div>
              <div className="flex-1 bg-indigo-500 rounded-t-lg" style={{height: '75%'}}></div>
              <div className="flex-1 bg-indigo-300 rounded-t-lg" style={{height: '60%'}}></div>
              <div className="flex-1 bg-indigo-500 rounded-t-lg relative" style={{height: '90%'}}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  60%
                </div>
              </div>
              <div className="flex-1 bg-indigo-300 rounded-t-lg" style={{height: '55%'}}></div>
              <div className="flex-1 bg-indigo-500 rounded-t-lg" style={{height: '80%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1-10 Aug</span>
              <span>11-20 Aug</span>
              <span className="font-semibold text-gray-800">21-30 Aug</span>
              <span>1-10 Nov</span>
            </div>
          </div>

          {/* Analytic */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-800">Analytic</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">+5.4%</span>
              </div>
              <button className="text-sm text-gray-600 flex items-center gap-1">
                Month ▼
              </button>
            </div>
            <div className="h-64 flex items-end gap-6">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-300 rounded-t-xl" style={{height: '60%'}}></div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-500 rounded-t-xl" style={{height: '85%'}}></div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-300 rounded-t-xl" style={{height: '70%'}}></div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
              <div className="flex-1 flex flex-col items-center relative">
                <div className="w-full bg-indigo-500 rounded-t-xl relative" style={{height: '100%'}}>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-xl text-sm font-bold">
                    60%
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-300 rounded-t-xl" style={{height: '65%'}}></div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-500 rounded-t-xl" style={{height: '80%'}}></div>
                <span className="text-xs text-gray-500 mt-2"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Transaction History</h3>
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
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Invoice</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">People</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <span>👨</span>
                      </div>
                      <span className="font-medium text-gray-800">Flyod Johntosan</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Completed</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">Oct 8, 2025</td>
                  <td className="py-4 px-4 text-gray-800 font-medium">#INV-2025-001</td>
                  <td className="py-4 px-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gray-800 text-white text-xs rounded-full border-2 border-white flex items-center justify-center">+2</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard