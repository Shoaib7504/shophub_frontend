"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { TableSkeleton } from "@/components/ui/Skeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const LIMIT = 10;
const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", { search, role, page, limit: LIMIT }],
    queryFn: () => userService.getUsers({ search, role, page, limit: LIMIT }),
  });

  const qc = useQueryClient();
  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast.success("User deleted"); setDeleteId(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Users</h1>
        <p className="text-sm text-on-surface-muted">{data?.total ?? 0} users total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-surface-high flex flex-wrap gap-3">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users…" className="flex-1 min-w-48" />
          <Select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} options={roleOptions} className="w-36" />
        </div>
        <div className="overflow-x-auto">
          {isError ? <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>
            : isLoading ? <div className="p-6"><TableSkeleton /></div>
            : data?.users.length === 0 ? <EmptyState title="No users found" icon="users" />
            : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-low text-left">
                    {["Name","Email","Role","Created","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0edef]">
                  {data?.users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f9f7f8] transition-colors">
                      <td className="px-5 py-3 font-semibold text-on-surface">{u.name}</td>
                      <td className="px-5 py-3 text-on-surface-muted">{u.email}</td>
                      <td className="px-5 py-3"><StatusBadge status={u.role} /></td>
                      <td className="px-5 py-3 text-on-surface-muted whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => setDeleteId(u.id)} className="p-1.5 text-on-surface-muted hover:bg-error-container hover:text-error rounded-lg transition-all"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
        {(data?.total ?? 0) > LIMIT && (
          <div className="p-4 border-t border-surface-high">
            <Pagination page={page} total={data?.total ?? 0} limit={LIMIT} onChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && deleteUser.mutate(deleteId)} message="This will soft-delete this user account." loading={deleteUser.isPending} />
    </div>
  );
}
