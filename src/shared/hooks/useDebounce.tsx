import { useCallback, useEffect, useRef } from 'react';

type AnyFunction = (...args: any[]) => any;

function useDebounceCallback<T extends AnyFunction>(
  callback: T,
  delay: number,
  deps: any[] = []
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delay
      );
    },
    [delay, ...deps]
  ) as T;
}

export default useDebounceCallback;
