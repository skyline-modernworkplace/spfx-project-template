import { useLayoutEffect, useRef, useState } from "react";
import shave from "shave";

export default function useShave(maxHeight) {
  let elemRef = useRef(null);
  let [enabled, setEnabled] = useState(true);
  let [isTruncated, setIsTruncated] = useState(enabled);
  let [canTruncate, setCanTruncate] = useState(true);

  useLayoutEffect(() => {
    const tryShave = () => {
      if (elemRef.current && enabled && maxHeight) {
        shave(elemRef.current, maxHeight);
      }
      setCanTruncate(elemRef.current.offsetHeight >= maxHeight);
      setIsTruncated(!!elemRef.current.querySelector(".js-shave"));
    };

    tryShave();
    // Reshave when the window size changes
    window.addEventListener("resize", tryShave);

    // When the effect dependencies change, the effect runs again.
    // But first, the previous effect will be cleaned up by invoking
    // the cleanup function that the effect returns.
    return () => window.removeEventListener("resize", tryShave);
  }, [maxHeight, enabled]);

  return [
    {
      ref: elemRef,
      key: enabled,
    },
    {
      isTruncated,
      canTruncate,
    },
    setEnabled,
  ] as any;
}
