"use client";

import { useState } from "react";
import { useAllReviews, useDeleteReview } from "@/hooks/useReviews";
import { TableSkeleton } from "@/components/ui/Skeleton";
import RatingStars from "@/components/ui/RatingStars";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const LIMIT = 10;

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAllReviews({ page, limit: LIMIT });
  const deleteReview = useDeleteReview();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Reviews</h1>
        <p className="text-sm text-[#76777d]">{data?.total ?? 0} reviews total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          {isError ? <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>
            : isLoading ? <div className="p-6"><TableSkeleton /></div>
            : data?.reviews.length === 0 ? <EmptyState title="No reviews yet" icon="reviews" />
            : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f6f3f5] text-left">
                    {["Reviewer","Product","Rating","Comment","Date","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-[#76777d] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0edef]">
                  {data?.reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-[#f9f7f8] transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#1b1b1d]">{r.user?.name ?? "—"}</td>
                      <td className="px-5 py-3 text-[#45464d] max-w-xs truncate">{r.product?.title ?? "—"}</td>
                      <td className="px-5 py-3"><RatingStars rating={r.rating} size={14} /></td>
                      <td className="px-5 py-3 text-[#76777d] max-w-xs truncate">{r.comment ?? "—"}</td>
                      <td className="px-5 py-3 text-[#76777d] whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => setDeleteId(r.id)} className="p-1.5 text-[#76777d] hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-lg transition-all"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
        {(data?.total ?? 0) > LIMIT && (
          <div className="p-4 border-t border-[#eae7e9]">
            <Pagination page={page} total={data?.total ?? 0} limit={LIMIT} onChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deleteReview.mutateAsync(deleteId); setDeleteId(null); } }}
        message="This will permanently remove this review."
        loading={deleteReview.isPending}
      />
    </div>
  );
}
