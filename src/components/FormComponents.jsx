import React from 'react';

// Form section with title and optional description
export function FormSection({ title, description, children }) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Form input with label and optional error message
export function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon: Icon,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-surface-900 dark:text-white"
      >
        {label}
        {required && <span className="ml-1 text-secondary">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-surface-500" />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-secondary' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-secondary">{error}</p>}
    </div>
  );
}

// Add more form components as needed (checkboxes, selects, textareas, etc.)
export function FormDivider() {
  return <hr className="my-6 border-surface-200 dark:border-surface-700" />;
}