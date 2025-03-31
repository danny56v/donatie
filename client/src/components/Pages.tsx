import React from "react";
import clsx from "clsx";

interface PagesProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pages({ currentPage, totalPages, onChange }: PagesProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const visiblePages = new Set<number>();

    // Adăugăm primele 2 pagini
    visiblePages.add(1);
    visiblePages.add(2);

    // Adăugăm ultimele 2 pagini
    visiblePages.add(totalPages);
    visiblePages.add(totalPages - 1);

    // Adăugăm două pagini înainte și după pagina curentă
    visiblePages.add(currentPage);
    visiblePages.add(currentPage - 1);
    visiblePages.add(currentPage + 1);

    // Generăm butoanele paginilor
    let prevPage = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (visiblePages.has(i)) {
        if (prevPage !== 0 && i - prevPage > 1) {
          pages.push(
            <span key={`gap-${i}`} className="px-2 text-zinc-500">
              ...
            </span>
          );
        }
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={clsx(
              "px-4 py-2 rounded-md",
              currentPage === i ? "text-zinc-900 bg-zinc-200 hover:bg-zinc-300" : "hover:bg-zinc-200"
            )}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
        prevPage = i;
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "px-4 py-2 rounded-md",
          currentPage === 1 ? "text-zinc-400 cursor-not-allowed" : "text-zinc-900 hover:bg-zinc-200"
        )}
      >
        ←
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "px-4 py-2 rounded-md",
          currentPage === totalPages ? "text-zinc-400 cursor-not-allowed" : "text-zinc-900 hover:bg-zinc-200"
        )}
      >
        →
      </button>
    </div>
  );
}
