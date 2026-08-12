"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-on-surface-muted">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3 text-sm text-on-surface",
              "placeholder:text-on-surface-muted",
              "transition-all duration-200",
              "outline-none",
              "focus:border-secondary focus:ring-2 focus:ring-secondary/20",
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-outline-variant",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 text-on-surface-muted hover:text-on-surface transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <span className="absolute right-3 text-on-surface-muted">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-error" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-on-surface-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
