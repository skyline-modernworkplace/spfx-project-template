import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import useHover from "./useHover";
import usePaging, { PagingContext } from "./usePaging";

export default function useAutoPaging(totalPages: number, delay = 5000, defaultPage = 1) {
  let { currentPage, goForward, goBack, goTo } = usePaging(totalPages, defaultPage);
  let [pageDelay, setPageDelay] = useState(delay);

  useEffect(() => {
    setPageDelay(delay);
  }, [delay]);

  useInterval(goForward, pageDelay);

  const start = () => setPageDelay(delay);
  const stop = () => setPageDelay(0);

  return {
    currentPage,
    goForward,
    goBack,
    goTo,
    pauseEvents: {
      onMouseEnter: stop,
      onMouseLeave: start,
    },
    startPaging: start,
    stopPaging: stop,
  } as AutoPagingContext;
}

export interface AutoPagingContext extends PagingContext {
  /** Begin auto paging */
  startPaging: () => void;
  /** Pause auto paging */
  stopPaging: () => void;
  /** Events to spread onto the element that should pause when hovered */
  pauseEvents: {
    onMouseEnter: any;
    onMouseLeave: any;
  };
}
