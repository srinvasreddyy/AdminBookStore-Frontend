import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const CategoryBreadcrumbs = ({ currentCategory, categories, onNavigate }) => {
  // Helper to find path from root to current category
  const findPath = (targetId, currentList, path = []) => {
    for (const cat of currentList) {
      if (cat._id === targetId) return [...path, cat];
      if (cat.children && cat.children.length > 0) {
        const found = findPath(targetId, cat.children, [...path, cat]);
        if (found) return found;
      }
    }
    return null;
  };

  const path = currentCategory ? findPath(currentCategory._id, categories) || [] : [];

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
      <button 
        onClick={() => onNavigate(null)}
        className="flex items-center hover:text-black transition-colors font-medium"
      >
        <Home size={16} className="mr-1" />
        Home
      </button>
      
      {path.map((cat) => (
        <React.Fragment key={cat._id}>
          <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => onNavigate(cat)}
            className={`hover:text-black transition-colors ${
              cat._id === currentCategory?._id ? "font-bold text-black" : ""
            }`}
          >
            {cat.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CategoryBreadcrumbs;