// import React from "react";

// function Shave({ children, el = "div", maxHeight = 100, enabled = true }) {
//   let Element = el as any;
//   let elemRef = React.useRef(null);
//   React.useEffect(() => {
//     if (enabled) {
//       shave(elemRef.current, maxHeight);
//     }
//   }, [children, maxHeight, enabled]);

//   return (
//     <Element key={enabled} ref={elemRef} data-enabled={enabled}>
//       {children}
//     </Element>
//   );
// }

import React, { ReactElement, useEffect } from "react";
import shave from "shave";

const CLASS_NAME = "shaved";

export interface ShaveProps {
  // props
  /** The max height of the element. The component will fit as many lines of text as it can. */
  maxHeight: number;
  /** Default is div. The type of element to use */
  el?: any;
  /** Default is true. Allows you to toggle the shave on and off */
  enabled?: boolean;
  /** Class name for CSS overrides */
  className?: string;
  [key: string]: any;
}

export const Shave: React.FC<ShaveProps> = ({
  el = "div",
  enabled = true,
  maxHeight = 100,
  children,
  className = "",
  ...additionalProps
}) => {
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  let Element = el as any;
  let elemRef = React.useRef(null);

  useEffect(() => {
    const tryShave = () => {
      if (elemRef.current && enabled) {
        shave(elemRef.current, maxHeight);
      }
    };

    tryShave();

    // Reshave when the window size changes
    window.addEventListener("resize", tryShave);

    // When the effect dependencies change, the effect runs again.
    // But first, the previous effect will be cleaned up by invoking
    // the cleanup function that the effect returns.
    return () => window.removeEventListener("resize", tryShave);
  }, [maxHeight, enabled, children]);

  return (
    <Element
      key={enabled}
      ref={elemRef}
      className={cssClass}
      {...additionalProps}
      data-enabled={enabled}
    >
      {children}
    </Element>
  );
};

export default Shave;
