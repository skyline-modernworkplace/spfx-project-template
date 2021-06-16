import { useState, useEffect, useRef } from "react";

export function useDebouncedValue(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update state to the passed in value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      // If our value changes (or the component unmounts), React will
      // run this cleanup function to cancel the state update.
      clearTimeout(handler);
    };
    // These are the dependencies, if the value or the delay amount
    // changes, then cancel any existing timeout and start waiting again
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;

export function useDebouncedEffect(effectFn, value, delay = 250) {
  // Store the effect function as a ref so that we don't
  // trigger a re-render each time the function changes
  let effectRef = useRef(effectFn);
  // Leverage the hook we just created above
  let debouncedValue = useDebouncedValue(value, delay);
  
  // Keep the Effect Function in sync
  useEffect(() => {
    effectRef.current = effectFn; 
  });
  
  // Run an effect whenever the debounced value
  useEffect(() => {
    if (effectRef.current) {
      // Invoke the effect function, passing the debouncedValue
      return effectRef.current(debouncedValue);
    }
  }, [debouncedValue]);
}

export interface UseDebounceParams {
  /** Whatever value you want to track */
  value: any;
  /** Milliseconds, how long to wait before actually updating */
  delay: number;
}

// EXAMPLE usage
// let updatedTitle = useDebounce(title, 200);
// useEffect(() => {
//     props.onChange(updatedTitle);
// }, [updatedTitle])
