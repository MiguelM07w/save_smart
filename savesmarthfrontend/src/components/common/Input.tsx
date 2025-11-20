import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'input-error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
