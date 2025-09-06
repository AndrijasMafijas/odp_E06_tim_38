import React from 'react';

interface FormButtonsProps {
  primaryText: string;
  secondaryText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  primaryDisabled?: boolean;
  loading?: boolean;
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled = false,
  loading = false
}) => {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        onClick={onPrimaryClick}
        disabled={primaryDisabled || loading}
        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
      >
        {loading ? 'Snimanje...' : primaryText}
      </button>
      <button
        type="button"
        onClick={onSecondaryClick}
        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {secondaryText}
      </button>
    </div>
  );
};
