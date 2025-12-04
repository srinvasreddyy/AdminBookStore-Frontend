import React, { useState } from 'react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';

const CategoryItem = ({ category, selectedCategoryId, onSelect, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category._id;

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    onSelect(category._id);
  };

  return (
    <div className="select-none">
      <div 
        className={`
          group flex items-center justify-between px-3 py-2 my-0.5 rounded-lg cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'bg-neutral-900 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`opacity-70 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
            {hasChildren && isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
          </span>
          
          <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : ''}`}>
            {category.name}
          </span>
        </div>

        {hasChildren && (
          <button
            onClick={handleExpand}
            className={`
              p-1 rounded-full hover:bg-white/10 transition-transform duration-200
              ${isExpanded ? 'rotate-90' : ''}
              ${isSelected ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:bg-gray-200'}
            `}
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Recursive Children */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {hasChildren && category.children.map(child => (
          <CategoryItem 
            key={child._id} 
            category={child} 
            selectedCategoryId={selectedCategoryId} 
            onSelect={onSelect} 
            depth={depth + 1} 
          />
        ))}
      </div>
    </div>
  );
};

const CategorySidebar = ({ categories, selectedCategoryId, onSelect }) => {
  return (
    <div className="w-full">
      <div className="mb-4 px-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Categories
        </h3>
      </div>
      
      {/* "All Books" Option */}
      <div 
        className={`
          flex items-center gap-3 px-3 py-2 my-1 mb-3 rounded-lg cursor-pointer transition-all
          ${!selectedCategoryId 
            ? 'bg-neutral-900 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        onClick={() => onSelect(null)}
      >
        <Folder size={16} className={!selectedCategoryId ? 'text-white' : 'text-gray-400'} />
        <span className="text-sm font-medium">All Books</span>
      </div>

      <div className="space-y-0.5">
        {categories.map(category => (
          <CategoryItem 
            key={category._id} 
            category={category} 
            selectedCategoryId={selectedCategoryId} 
            onSelect={onSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;