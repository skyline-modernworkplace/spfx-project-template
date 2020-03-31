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
  };
}

export const usePagedItems = function(allItems, numItems, intialPage = 1) {
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
