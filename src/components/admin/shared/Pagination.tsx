"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl font-bold transition-all ${
            currentPage === i
              ? "bg-fowy-primary text-white shadow-lg shadow-fowy-red/20"
              : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        Mostrando <span className="text-slate-700">{(currentPage - 1) * pageSize + 1}</span> a{" "}
        <span className="text-slate-700">{Math.min(currentPage * pageSize, totalCount)}</span> de{" "}
        <span className="text-slate-700">{totalCount}</span> negocios
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5 mx-2">{renderPageNumbers()}</div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
