import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  placeholder?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  min,
  max,
  placeholder,
  className = ''
}) => {
  const baseClasses = "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500";
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        className={baseClasses}
      />
    </div>
  );
};
