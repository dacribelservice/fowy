"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Loader2 } from 'lucide-react';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  
  // Local Mode (e.g., filtering a local array)
  options?: string[];
  
  // Remote Mode (e.g., querying data from Supabase)
  onAsyncSearch?: (query: string) => Promise<string[]>;
}

export default function Autocomplete({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
  disabled = false,
  options,
  onAsyncSearch
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Synchronize internal state when the value changes from parent
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue(value || '');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Handle filtering and asynchronous search
  useEffect(() => {
    if (!isOpen) return;

    if (options) {
      // --- LOCAL MODE ---
      const query = inputValue.trim().toLowerCase();
      if (!query) {
        setFilteredOptions(options.slice(0, 100)); // Limit to first 100 items for smoothness
      } else {
        const filtered = options.filter(opt => 
          opt.toLowerCase().includes(query)
        );
        setFilteredOptions(filtered.slice(0, 100));
      }
    } else if (onAsyncSearch) {
      // --- REMOTE MODE (with 300ms Debounce) ---
      const query = inputValue.trim();
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      setIsLoading(true);
      
      debounceTimer.current = setTimeout(async () => {
        try {
          const results = await onAsyncSearch(query);
          setFilteredOptions(results || []);
        } catch (error) {
          console.error("Autocomplete async search error:", error);
          setFilteredOptions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300); // 300ms debounce as required
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, options, onAsyncSearch, isOpen]);

  // Reset focus index when options list changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [filteredOptions]);

  const handleSelect = (option: string) => {
    onChange(option);
    setInputValue(option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setInputValue('');
    if (options) {
      setFilteredOptions(options.slice(0, 100));
    } else {
      setFilteredOptions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (options && filteredOptions.length === 0) {
      setFilteredOptions(options.slice(0, 100));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setInputValue(value || '');
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        {/* Left Icon (Search indicator or Loading spinner) */}
        <div className="absolute left-5 text-slate-400 pointer-events-none z-10">
          {isLoading ? (
            <Loader2 className="animate-spin text-fowy-orange" size={18} />
          ) : (
            <Search size={18} />
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-12 pr-20 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-fowy-orange/20 focus:border-fowy-orange outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
        />

        {/* Right Action Buttons */}
        <div className="absolute right-4 flex items-center gap-1.5 z-10">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-slate-200/60 active:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-slate-200/60 active:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown 
              size={18} 
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-[999] mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-[260px] overflow-y-auto overflow-x-hidden divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = value === option;
              const isFocused = index === focusedIndex;
              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors flex items-center justify-between outline-none ${
                    isSelected 
                      ? 'text-fowy-orange bg-fowy-orange/5' 
                      : isFocused 
                        ? 'bg-slate-50 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-50/70 hover:text-slate-800'
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-fowy-orange shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-6 py-5 text-sm font-black text-slate-400 text-center uppercase tracking-wider">
              {isLoading ? "Buscando..." : "No hay resultados"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
