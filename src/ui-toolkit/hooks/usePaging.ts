import { useState } from "react";

export function usePaging(totalPages: number, initialPage = 1) {
  let [currentPage, setCurrentPage] = useState(initialPage);

  let goBack = () => {
    let newPage = currentPage - 1;
    if (newPage < 1) newPage = totalPages;
    setCurrentPage(newPage);
  };
  let goForward = () => {
    let newPage = currentPage + 1;
    if (newPage > totalPages) newPage = 1;
    setCurrentPage(newPage);
  };
  let goTo = (pageNumber: number) => {
    if (pageNumber > totalPages) pageNumber = totalPages;
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    goForward,
    goBack,
    goTo,
  } as PagingContext;
}

export const usePagedItems = function (allItems, numItems, intialPage = 1) {
  let paging = usePaging(allItems.length, intialPage);
  let startIndex = paging.currentPage - 1;
  let endIndex = startIndex + numItems;
  let isWrapping = endIndex > allItems.length;

  let items = allItems.slice(startIndex, endIndex);
  if (isWrapping) {
    items = [...items, ...allItems.slice(0, endIndex - allItems.length)];
  }

  return [items, paging];
};

export default usePaging;

export interface PagingContext {
  /** Go backwards one page. If you go below page 1, you will be sent to the last page. */
  goBack: () => void;
  /** Go forwards one page. If you exceed the max page, it will go back to the first page. */
  goForward: () => void;
  /** Jump to a specific page number */
  goTo: (page: number) => void;
  /** The current page in state */
  currentPage: number;
}
