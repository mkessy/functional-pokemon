import React from "react";

const PaginatedPageLink = (
  pageNumber: number,
  handleClick: (pageNum: number) => void
) => {
  return (
    <div
      onClick={() => handleClick(pageNumber)}
      aria-current="page"
      className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
    ></div>
  );
};

export default PaginatedPageLink;
