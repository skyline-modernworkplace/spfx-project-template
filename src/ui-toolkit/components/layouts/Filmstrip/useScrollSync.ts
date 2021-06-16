import { useState, useEffect, useRef } from "react";

// Everything to do with scrolling based on the the Paging
export default function useScrollSync({ itemsRef, itemWidth, paging }) {
  // Track scroll position in State
  let [scrollPosition, setScrollPosition] = useState(0);
  let [isScrolling, setIsScrolling] = useState(false);
  // Set scroll position based on the current page
  useEffect(() => {
    // // If we can't fill a full frame with items, cycle back to the beginning
    // if (paging.currentPage + numItemsThatFit > totalCount + 1) {
    //   paging.goTo(1);
    // } else {
    setScrollPosition((paging.currentPage - 1) * itemWidth);
  }, [paging.currentPage]);

  // Actually scroll the DOM element to match the tracked scroll position
  useEffect(() => {
    if (itemsRef.current) {
      console.log("Scrolling to", scrollPosition);
      itemsRef.current.scrollTo(scrollPosition, 0);
    }
  }, [scrollPosition]);

  // Any time we scroll (manually included), wait for the scrolling to stop
  // then figure out what page we are on based on the dom elements scroll position

  // Track the timeout across renders to enable debouncing
  let timeoutRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      setIsScrolling(true);
      // Cancel the previous handler if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Setup the new handler
      timeoutRef.current = setTimeout(function() {
        // Run our scroll functions
        // console.log(
        //   "currentPage = scrollLeft / itemWidth",
        //   e.target.scrollLeft / itemWidth,
        //   e.target.scrollLeft,
        //   itemWidth
        // );
        setIsScrolling(false);

        let currentPage = Math.floor(e.target.scrollLeft / itemWidth) + 1;

        if (paging.currentPage !== currentPage) {
          // console.log("GOTO", currentPage, paging.currentPage);
          paging.goTo(currentPage);
        }
      }, 60);
    };
    // Add the onScroll handler
    if (itemsRef.current) {
      // console.log("Adding scroll event");
      itemsRef.current.addEventListener("scroll", handler);
    }

    // Cleanup
    () => {
      // Unregister the event handler
      if (itemsRef.current) itemsRef.current.removeEventListener("scroll", handler);
      // Remove the delayed handler
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [itemWidth, paging.currentPage]);

  return { scrollPosition, isScrolling };
}
