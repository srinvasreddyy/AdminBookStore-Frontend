import React, { useState } from 'react'
import { Home, Layers2, Album, Plus, ShoppingBag, TvMinimal, Settings, HelpCircle, Menu, X, LogOut, Monitor, Phone, Users } from 'lucide-react'
import { TbCircleLetterBFilled } from "react-icons/tb"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'; // Adjust path if needed
import { TbShoppingBagDiscount } from "react-icons/tb";
const Layout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const mainMenuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Orders', icon: ShoppingBag, path: '/orders' },
    { name: 'Add Books', icon: Plus, path: '/add-books' },
    { name: 'Books Management', icon: Album, path: '/books-management' },
    { name: 'Category Management', icon: Layers2, path: '/category-management' },
    { name: 'Add HomePage Content', icon: TvMinimal, path: '/homepage-management' },
    { name: 'Manage HomePage', icon: Monitor, path: '/manage-homepage' },
    { name: 'Contact Management', icon: Phone, path: '/contact-management' },
    { name: 'Discounts', icon: TbShoppingBagDiscount, path: '/discounts' },
    { name: 'Client Management', icon: Users, path: '/client-management' },
  ]

  const toolsItems = [
   
    { name: 'Help', icon: HelpCircle, path: '/help' },
  ]

  const handleNavigate = (item) => {
    setActiveMenu(item.name)
    navigate({ to: item.path })
    setSidebarOpen(false) // close sidebar on mobile
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate({ to: '/login' })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200 z-50 flex flex-col w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-start flex-col gap-2">
            <img src={logo} alt="Logo" className="w-auto h-14 mr-2" />
            <h1 className="text-sm font-bold uppercase text-gray-800">Admin Portal</h1>
          </div>
          {/* Close Icon (mobile only) */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.name
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item)}
                className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-xs">{item.name}</span>
              </button>
            )
          })}

          {/* Tools Section */}
          <div className="pt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase px-4 mb-3">Tools</p>
            {toolsItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.name
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-xs">{item.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-neutral-600">
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-xs">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Top Header (mobile toggle) */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-gray-700">Dashboard</h2>
          <div className="w-5" /> {/* spacer for layout balance */}
        </header>

        <div className="">{children}</div>
      </main>
    </div>
  )
}

export default Layout
