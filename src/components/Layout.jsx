import React, { useState } from 'react'
import { Home, Layers2,Album,Plus, ShoppingBag, TvMinimal, Settings, HelpCircle, FolderOpen } from 'lucide-react'
import { TbCircleLetterBFilled } from "react-icons/tb";

const Layout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('Home')

  const mainMenuItems = [
    { name: 'Home', icon: Home },
    { name: 'Orders', icon: ShoppingBag},
    { name: 'Add Books', icon: Plus },
     { name: 'Books Management', icon: Album },
    { name: 'Category Management', icon: Layers2 },
    { name: 'HomePage Management', icon: TvMinimal },
  ]

  const toolsItems = [
    { name: 'Setting', icon: Settings },
    { name: 'Help', icon: HelpCircle },
  ]

 

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-70 border-r border-gray-200 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-1">
          <span><TbCircleLetterBFilled className="text-3xl" /></span>
          <h1 className="text-sm font-bold uppercase text-gray-800">BookStore Admin</h1>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4 py-2 space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.name
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white '
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
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              )
            })}
          </div>

          
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout