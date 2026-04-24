"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, required, error, children }: FieldWrapperProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function TextInput({ error, className, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white",
        className
      )}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      rows={3}
      className={clsx(
        "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none",
        error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white",
        className
      )}
    />
  );
}

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}

export function RadioGroup({ name, options, value, onChange, error }: RadioGroupProps) {
  return (
    <div className={clsx("flex flex-wrap gap-3", error && "")}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition",
            value === opt.value
              ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
