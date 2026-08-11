"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full min-h-[100px] rounded-xl border bg-white px-3 py-2.5 text-sm text-[#1b1b1d]",
            "placeholder:text-[#76777d] resize-y",
            "transition-all duration-200 outline-none",
            "focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20",
            error ? "border-[#ba1a1a]" : "border-[#c6c6cd]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#ba1a1a]" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-[#76777d]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
