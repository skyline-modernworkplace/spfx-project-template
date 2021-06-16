import { useState, useCallback } from "react";
import * as qs from "querystring";
import { useDebouncedEffect } from "./useDebounce";

function useQueryString<T>(key, initialValue: T, delay = 0) {
  const [value, setValue] = useState<T>(getQueryStringValue(key) || initialValue);
  useDebouncedEffect(
    (debouncedValue) => {
      setQueryStringValue(key, debouncedValue);
    },
    value,
    delay
  );

  const onSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
    },
    [key]
  );

  return [value, onSetValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useQueryString;

const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl =
    window.location.protocol + "//" + window.location.host + window.location.pathname + qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

const setQueryStringValue = (
  key,
  value,
  queryString = (window.location.search || "").substr(1)
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
  key,
  queryString = (window.location.search || "").substr(1)
) => {
  const values = qs.parse(queryString);
  return values[key];
};
