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
            className="text-sm font-medium text-[#1b1b1d] font-[family-name:var(--font-geist)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#76777d]">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              "w-full h-10 rounded-xl border bg-white px-3 text-sm text-[#1b1b1d]",
              "placeholder:text-[#76777d]",
              "transition-all duration-200",
              "outline-none",
              "focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20",
              error
                ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20"
                : "border-[#c6c6cd]",
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
              className="absolute right-3 text-[#76777d] hover:text-[#1b1b1d] transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <span className="absolute right-3 text-[#76777d]">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-[#ba1a1a]" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-[#76777d]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
