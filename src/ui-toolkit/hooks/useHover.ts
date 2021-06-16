import { useState, useRef, useEffect } from "react";

export default function useHover(hoverRef: React.MutableRefObject<Element>) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);
    const elem = hoverRef.current;
    if (elem) {
      elem.addEventListener("mouseover", handleMouseOver);
      elem.addEventListener("mouseout", handleMouseOut);

      return () => {
        elem.removeEventListener("mouseover", handleMouseOver);
        elem.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [hoverRef.current]); // Recall only if ref changes

  return isHovered;
}
