"use client";

import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If the parent changed the value, show it in the input too
  if (lastValue !== value) {
    setLastValue(value);
    setLocalValue(value);
  }

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), debounceMs);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        size={16}
        className="absolute left-3 text-on-surface-muted pointer-events-none"
      />
      <input
        type="search"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-9 pr-9 rounded-xl border border-outline-variant bg-white",
          "text-sm text-on-surface placeholder:text-on-surface-muted",
          "outline-none transition-all duration-200",
          "focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        )}
      />
      {localValue && (
        <button
          type="button"
          onClick={() => handleChange("")}
          className="absolute right-3 text-on-surface-muted hover:text-on-surface transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
