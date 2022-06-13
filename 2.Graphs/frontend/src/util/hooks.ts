import { useEffect, useState } from "react";

export const useDebounce = (
  value: string | number,
  timeout: number
): string | number => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(handler);
  }, [value, timeout]);

  return state;
};
