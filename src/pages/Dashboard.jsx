import React, { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import BookCard from "../components/BookCard";
import FilterBar from "../components/FilterBar";
import CategorySidebar from "../components/CategorySidebar";
import CategoryBreadcrumbs from "../components/CategoryBreadcrumbs";
import { BookOpen, Menu, X, Folder, Image as ImageIcon, ArrowRight, Layers } from "lucide-react";

const Dashboard = () => {
  // --- Data State ---
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  
  // --- UI State ---
  const [loading, setLoading] = useState(true); // Initial load (categories)
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Filter & Navigation State ---
  // We use `currentCategory` object for the Tree View / Breadcrumbs logic
  const [currentCategory, setCurrentCategory] = useState(null); 
  const [filters, setFilters] = useState({
    search: "",
    category: "", // This syncs with FilterBar dropdown (ID)
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  // 1. Initial Load: Fetch full Category Tree
  useEffect(() => {
    async function init() {
      try {
        const response = await apiGet("/categories");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 2. Logic: Determine what to show (Subcategories Grid vs Books Grid)
  // If the current category has children, we default to showing them in a grid.
  // Unless the user is searching or explicit filters are active.
  const subCategories = currentCategory 
    ? (currentCategory.children || []) 
    : categories; // Root categories if no selection

  const showBooksMode = (currentCategory && subCategories.length === 0) || filters.search;

  // 3. Fetch Books when in Book Mode
  useEffect(() => {
    if (showBooksMode) {
      fetchBooks();
    }
  }, [currentCategory, filters.status, filters.minPrice, filters.maxPrice, filters.search, showBooksMode]);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const params = new URLSearchParams();
      // Use the selected category ID (from tree or dropdown)
      const activeCatId = currentCategory?._id || filters.category;
      if (activeCatId) params.append("category", activeCatId);
      if (filters.search) params.append("search", filters.search);

      const response = await apiGet(`/books?${params.toString()}`);
      let docs = response.data?.docs || response.data || [];

      // Client-side filtering for demo (backend usually handles these)
      if (filters.minPrice) docs = docs.filter(b => b.price >= Number(filters.minPrice));
      if (filters.maxPrice) docs = docs.filter(b => b.price <= Number(filters.maxPrice));
      if (filters.status === 'in-stock') docs = docs.filter(b => b.stock > 0);
      else if (filters.status === 'low-stock') docs = docs.filter(b => b.stock > 0 && b.stock < 5);

      setBooks(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBooks(false);
    }
  };

  // --- Handlers ---

  // Handle tree navigation or grid click
  const handleCategorySelect = (categoryId) => {
    // Recursive find
    const findCat = (id, list) => {
      for (const item of list) {
        if (item._id === id) return item;
        if (item.children) {
          const found = findCat(id, item.children);
          if (found) return found;
        }
      }
      return null;
    };

    if (!categoryId) {
      setCurrentCategory(null);
      setFilters(prev => ({ ...prev, category: "" }));
    } else {
      const found = findCat(categoryId, categories);
      setCurrentCategory(found);
      setFilters(prev => ({ ...prev, category: categoryId }));
    }
    
    setMobileMenuOpen(false);
    // Clear search to exit search mode and see the category structure
    setFilters(prev => ({ ...prev, search: "" }));
  };

  const handleApplyFilters = () => {
    // Triggered by "Apply" button - specifically for Price/Status
    fetchBooks();
  };

  const handleClearFilters = () => {
    setFilters({ search: "", category: "", status: "", minPrice: "", maxPrice: "" });
    setCurrentCategory(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* === MOBILE HEADER === */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <BookOpen className="w-6 h-6" /> <span className="text-lg">BookStore</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
        >
          <Menu size={24}/>
        </button>
      </header>

      {/* === SIDEBAR (Desktop & Mobile) === */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100 hidden md:flex items-center gap-3 text-gray-900">
                <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                    <BookOpen size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-xl tracking-tight">BookStore</span>
            </div>
            
            {/* Mobile Sidebar Close */}
            <div className="md:hidden p-4 border-b flex justify-between items-center bg-gray-50">
               <span className="font-semibold text-gray-700">Browse Categories</span>
               <button onClick={() => setMobileMenuOpen(false)}>
                 <X size={20} className="text-gray-500"/>
               </button>
            </div>

            {/* Tree Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="space-y-4 animate-pulse px-2">
                        {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-md w-full"/>)}
                    </div>
                ) : (
                    <CategorySidebar 
                        categories={categories} 
                        selectedCategoryId={currentCategory?._id} 
                        onSelect={handleCategorySelect} 
                    />
                )}
            </div>
            
            <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                © 2024 BookStore App
            </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
                
                {/* 1. Breadcrumbs Navigation */}
                <CategoryBreadcrumbs 
                   currentCategory={currentCategory} 
                   categories={categories} 
                   onNavigate={(cat) => handleCategorySelect(cat?._id || null)}
                />

                {/* 2. Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {currentCategory ? currentCategory.name : "Explore Collection"}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm max-w-2xl">
                        {currentCategory?.description || "Browse by category or search below to find book"}
                    </p>
                </div>

                {/* 3. Filter Bar (Categories passed for dropdown) */}
                <FilterBar 
                    filters={filters}
                    setFilters={setFilters}
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    categories={categories} 
                />

                {/* 4. CONTENT VIEW SWITCHER */}
                
                {/* MODE A: SUBCATEGORY BROWSING (Folder View) */}
                {!showBooksMode && (
                  <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                            {currentCategory ? `Subcategories in ${currentCategory.name}` : "View by Category"}
                        </h2>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subCategories.map((cat) => (
                           <div 
                             key={cat._id}
                             onClick={() => handleCategorySelect(cat._id)}
                             className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center text-center gap-3"
                           >
                              {/* Icon / Image Placeholder */}
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                 {cat.backgroundImage ? (
                                    <img src={cat.backgroundImage} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                                 ) : (
                                    <Folder size={28} />
                                 )}
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-900 group-hover:text-black">{cat.name}</h3>
                                 <p className="text-xs text-gray-400 mt-1">
                                    {cat.children?.length > 0 ? `${cat.children.length} sub-categories` : "Browse Books"}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                     
                     {/* Bypass option if user wants to see all books inside this parent immediately */}
                     {currentCategory && (
                       <div className="mt-10 text-center">
                          <button 
                            onClick={() => setFilters(prev => ({...prev, search: " "}))} // Space triggers search mode
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-gray-400"
                          >
                            Skip categories and view all books here <ArrowRight size={14}/>
                          </button>
                       </div>
                     )}
                  </div>
                )}

                {/* MODE B: BOOKS LISTING */}
                {showBooksMode && (
                  <div className="animate-in fade-in duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                           {filters.search.trim() ? "Search Results" : `Books in ${currentCategory?.name || 'All'}`}
                        </h2>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{books.length} items</span>
                      </div>

                      {loadingBooks ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="bg-white rounded-2xl h-80 p-4 border border-gray-100">
                                   <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 animate-pulse"></div>
                                   <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse"></div>
                                   <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                                </div>
                              ))}
                          </div>
                      ) : books.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                  <ImageIcon size={32} />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">No books found</h3>
                              <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                                  Try adjusting your price filters or search for something else.
                              </p>
                              <button 
                                  onClick={handleClearFilters}
                                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-md"
                              >
                                  Clear Filters
                              </button>
                          </div>
                      )}
                  </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;