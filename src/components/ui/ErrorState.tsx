import { AlertCircle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] flex items-center justify-center">
        <AlertCircle size={28} className="text-[#ba1a1a]" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-base font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)]">
          {title}
        </p>
        <p className="text-sm text-[#76777d]">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
