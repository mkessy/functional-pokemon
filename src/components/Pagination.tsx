import React from "react";
import PaginatedPageLink from "./PaginatedPageLink";
import * as O from "fp-ts/Option";
import * as RO from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/lib/function";

type PaginationProps = {
  pageUrls: ReadonlyArray<O.Option<string>>;
  handleChangePage: (pageNum: number) => void;
};

const Pagination = ({ pageUrls, handleChangePage }: PaginationProps) => {
  return (
    <div>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <a
          href={"/"}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            x-description="Heroicon name: solid/chevron-left"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
        {pipe(
          pageUrls,
          RO.mapWithIndex((i, url) => PaginatedPageLink(i, handleChangePage))
        )}

        <a
          href={"/"}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            x-description="Heroicon name: solid/chevron-right"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </nav>
    </div>
  );
};

export default Pagination;
