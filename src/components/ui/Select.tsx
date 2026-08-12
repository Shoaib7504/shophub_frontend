"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, options, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-on-surface font-display"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3 pr-9 text-sm text-on-surface appearance-none cursor-pointer",
              "transition-all duration-200 outline-none",
              "focus:border-secondary focus:ring-2 focus:ring-secondary/20",
              error
                ? "border-error"
                : "border-outline-variant",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-error" role="alert">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
