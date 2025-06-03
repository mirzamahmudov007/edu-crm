import { useState, useEffect, useCallback } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

const PHONE_REGEX = /^998(\d{2})(\d{3})(\d{2})(\d{2})$/;
const MAX_LENGTH = 12; // 998 + 9 digits

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '+998 XX XXX XX XX',
  required = false,
  error = '',
  disabled = false,
  onBlur,
  onFocus,
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const formatPhoneNumber = useCallback((phone: string): string => {
    if (!phone) return '';

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If the number doesn't start with 998, add it
    const withPrefix = cleaned.startsWith('998') ? cleaned : `998${cleaned}`;
    
    // Format the number
    const match = withPrefix.match(PHONE_REGEX);
    if (match) {
      return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    
    // If the number is incomplete, format what we have
    if (withPrefix.length > 0) {
      const remainingDigits = withPrefix.slice(3);
      const formatted = remainingDigits.replace(/(\d{3})(?=\d)/g, '$1 ');
      return `+998 ${formatted}`;
    }
    
    return '';
  }, []);

  useEffect(() => {
    // Format the initial value
    const formatted = formatPhoneNumber(value);
    setDisplayValue(formatted);
  }, [value, formatPhoneNumber]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    
    // If the number doesn't start with 998, add it
    const withPrefix = cleaned.startsWith('998') ? cleaned : `998${cleaned}`;
    
    // Limit to MAX_LENGTH digits
    const limited = withPrefix.slice(0, MAX_LENGTH);
    
    // Update the display value
    setDisplayValue(formatPhoneNumber(limited));
    
    // Call the onChange with the raw value
    onChange(limited);
  }, [onChange, formatPhoneNumber]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <div className="relative">
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full px-4 py-2 border 
          ${error ? 'border-rose-500' : isFocused ? 'border-blue-500' : 'border-gray-200'} 
          rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          transition-all 
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} 
          ${className}
        `}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? 'phone-error' : undefined}
      />
      {error && (
        <p 
          id="phone-error"
          className="mt-1 text-sm text-rose-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}; 