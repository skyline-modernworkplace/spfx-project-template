import { useRef, useEffect, useState } from "react";
import useHowManyFit from "../../hooks/useHowManyFit";
import { usePaging, usePagedItems } from "../../hooks/usePaging";
import useHover from "../../hooks/useHover";
import useInterval from "../../hooks/useInterval";
import useComponentSize from "../../hooks/useComponentSize";
import useScrollSync from "./useScrollSync";

export interface FilmstripOptions {
  itemMinWidth?: number;
  spacing?: number;
  autopage?: number;
}

const defaults: FilmstripOptions = {
  itemMinWidth: 300,
  spacing: 10,
  autopage: 0,
};

export default function useFilmstrip(
  totalCount: number,
  paneRef: React.MutableRefObject<Element>,
  opts = defaults
) {
  // Keep track of the 'filmstrip-items' ref which is used for scrolling
  let itemsRef = useRef<any>(paneRef.current ? paneRef.current.firstChild : null);

  useEffect(() => {
    itemsRef.current = paneRef.current.firstChild;
  }, [paneRef.current]);

  let { itemMinWidth, spacing, autopage } = {
    ...defaults,
    ...opts,
  };
  // Figure out how many items fit based on the size of the Pane (topmost) element
  let [numItemsThatFit, itemWidth, parentWidth] = useHowManyFit(itemMinWidth, paneRef, {
    spacing,
  });

  if (totalCount < numItemsThatFit) {
    numItemsThatFit = totalCount;
  }
  let paging = usePaging(totalCount);

  // Cycle back to the beginning
  useEffect(() => {
    // Ex: 10 items w/ 3 per frame
    // When current page is 8, we'll see 8,9,10. If we hit "next", we want to go back to 1.
    if (paging.currentPage + numItemsThatFit > totalCount + 1) {
      console.log(paging.currentPage, numItemsThatFit, totalCount);
      paging.goTo(1);
    }
  }, [paging.currentPage, numItemsThatFit, totalCount]);

  let { scrollPosition, isScrolling } = useScrollSync({ itemsRef, itemWidth, paging });

  let isDisabled = totalCount <= numItemsThatFit;
  let isHovered = useHover(paneRef);
  if (autopage && autopage < 100) {
    autopage = autopage * 1000;
  }
  // Pause on hover or active scrolling
  if (isHovered || isScrolling || isDisabled) {
    autopage = 0;
  }
  useInterval(paging.goForward, autopage, [autopage, paging.currentPage].join(""));

  return {
    scrollPosition,
    paging: { ...paging, isDisabled },
    itemWidth,
    numItemsThatFit,
    parentWidth,
    itemHeight: getItemHeight(itemsRef),
  };
}

const getItemHeight = function(itemsRef) {
  if (
    itemsRef &&
    itemsRef.current &&
    itemsRef.current.firstChild &&
    itemsRef.current.firstChild.offsetHeight
  ) {
    return itemsRef.current.firstChild.offsetHeight;
  }
  return 0;
};
