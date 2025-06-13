import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions {
  initialValue?: string;
  debounceMs?: number;
}

export function useSearch({ initialValue = '', debounceMs = 500 }: UseSearchOptions = {}) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedValue = useDebounce(searchValue, debounceMs);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const searchParams = useMemo(() => ({
    search: debouncedValue,
  }), [debouncedValue]);

  return {
    searchValue,
    debouncedValue,
    handleSearch,
    searchParams,
  };
} 