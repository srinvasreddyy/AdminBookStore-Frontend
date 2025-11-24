import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  HelpCircle,
  Home,
  ShoppingBag,
  BookOpen,
  Layers2,
  Monitor,
  Gift,
  FileText,
  Phone,
  Users,
  Percent,
  ArrowRight,
  Plus,
  Settings,
  ShieldCheck,
  Lock
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

const Help = () => {
  const helpSections = [
    {
      title: 'Dashboard Overview',
      icon: Home,
      path: '/',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'View a snapshot of your store\'s performance, including recent orders, total sales, and quick status updates.',
      features: ['Real-time sales metrics', 'Recent order activity', 'Quick navigation']
    },
    {
      title: 'Order Management',
      icon: ShoppingBag,
      path: '/orders',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Track and manage customer orders from placement to delivery. Update statuses and handle cancellations.',
      features: ['Filter orders', 'Update shipping status', 'View customer details']
    },
    {
      title: 'Book Inventory',
      icon: BookOpen,
      path: '/books-management',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Manage your entire book catalog. Add new titles, update prices, stock levels, and organize your library.',
      features: ['Add/Edit books', 'Stock & pricing', 'Cover images', 'Featured status'],
      secondaryLink: { label: 'Add Book', path: '/add-books', icon: Plus }
    },
    {
      title: 'Categories',
      icon: Layers2,
      path: '/category-management',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      description: 'Structure your bookstore by creating and managing categories. Keep inventory organized.',
      features: ['Create categories', 'Subcategories', 'Category banners', 'Pinning']
    },
    {
      title: 'Homepage Layout',
      icon: Monitor,
      path: '/homepage-management',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Control the look of your customer-facing homepage. Manage carousels and featured sections.',
      features: ['Hero Carousel', 'YouTube sections', 'Visibility toggles'],
      secondaryLink: { label: 'Manage', path: '/manage-homepage' }
    },
    {
      title: 'Specials',
      icon: Gift,
      path: '/add-specials',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Create curated collections for events or exclusive releases. These appear in the "Specials" section.',
      features: ['Image galleries', 'Event descriptions', 'Exclusive collections']
    },
    {
      title: 'Free Content',
      icon: FileText,
      path: '/add-free-content',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      description: 'Upload free PDF resources for your community. Great for sharing samples or guides.',
      features: ['Upload PDFs', 'Set cover images', 'Downloadable content']
    },
    {
      title: 'Contact Info',
      icon: Phone,
      path: '/contact-management',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'Keep your business contact information up to date, including address and social links.',
      features: ['Contact details', 'Social media links', 'Business hours']
    },
    {
      title: 'Clients & Partners',
      icon: Users,
      path: '/client-management',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      description: 'Manage the "Our Clients" or "Partners" section by uploading client logos.',
      features: ['Add logos', 'External links', 'Visibility control']
    },
    {
      title: 'Discounts',
      icon: Percent,
      path: '/discounts',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      description: 'Create and manage discount codes to drive sales and promotions.',
      features: ['Promo codes', 'Discount amounts', 'Expiry dates']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 relative overflow-hidden pb-12">
      {/* Creative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-in slide-in-from-top-5 duration-700 fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Help Center</h1>
              <p className="text-gray-500 font-medium">Admin Guide & Documentation</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {helpSections.map((section, index) => (
            <div 
              key={index} 
              className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
              {/* Hover Gradient Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${section.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${section.bg} ${section.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  {/* Optional: Quick Action Icon */}
                  <Link to={section.path} className="text-gray-300 hover:text-indigo-600 transition-colors">
                    <Settings className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                  {section.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  {section.description}
                </p>

                <div className="space-y-2">
                  {section.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full ${section.bg.replace('bg-', 'bg-').replace('50', '400')}`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100/50 flex gap-3 mt-auto bg-white/30">
                <Link 
                  to={section.path}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow group/btn"
                >
                  Manage
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-1 transition-all" />
                </Link>
                
                {section.secondaryLink && (
                  <Link 
                    to={section.secondaryLink.path}
                    className={`p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all shadow-sm hover:shadow`}
                    title={section.secondaryLink.label}
                  >
                    {section.secondaryLink.icon ? (
                      <section.secondaryLink.icon className="w-5 h-5" />
                    ) : (
                      <Settings className="w-5 h-5" />
                    )}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Privileges Summary - Creative Layout */}
        <div className="mt-12 relative overflow-hidden rounded-3xl bg-black text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-8 h-8 text-green-400" />
              <h2 className="text-2xl font-bold tracking-wide">Admin Privileges & Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <Lock className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-white">Full Access Control</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      As an administrator, you have unrestricted <span className="text-white font-medium">CRUD (Create, Read, Update, Delete)</span> access across all modules. Actions taken here reflect instantly on the public website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-white">Data Sensitivity</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      You have access to sensitive customer information including addresses and contact details. Always ensure you <span className="text-white font-medium">Logout</span> when using shared devices to maintain data integrity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help