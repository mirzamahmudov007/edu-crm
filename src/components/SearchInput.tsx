import { memo, useCallback } from 'react';
import { RiSearchLine } from 'react-icons/ri';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = memo(({ value, onChange, placeholder }: SearchInputProps) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="relative w-full sm:w-80">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
      />
      <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput; 