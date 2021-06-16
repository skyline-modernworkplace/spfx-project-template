import useComponentSize from "./useComponentSize";

export interface HowManyFitOptions {
  /** Allows you to cut off how many items will fit. Defaults to nothing. */
  maxItems?: number;
  /** Defaults to 0. Allows you to account for space between elements. You'll have*/
  spacing?: number;
}
const defaults: HowManyFitOptions = {
  maxItems: 0,
  spacing: 0,
};

export default function useHowManyFit(
  minWidth: number,
  parentRef: React.MutableRefObject<Element>,
  options = defaults
) {
  let { maxItems, spacing } = { ...defaults, ...options };
  let { width } = useComponentSize(parentRef);
  let numItems = Math.floor(width / minWidth);
  if (maxItems && numItems > maxItems) {
    numItems = maxItems;
  }
  if (numItems === 0) {
    numItems = 1;
  }
  let availableWidth = width - (numItems - 1) * spacing;
  let itemWidth = availableWidth / numItems;
  return [numItems, itemWidth, width] as [number, number, number];
}
