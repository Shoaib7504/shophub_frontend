"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { TableSkeleton } from "@/components/ui/Skeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { formatDate, stringToGradient } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const catSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
});
type CatFormData = z.infer<typeof catSchema>;

function CategoryFormModal({ open, onClose, category }: { open: boolean; onClose: () => void; category?: Category }) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CatFormData>({
    resolver: zodResolver(catSchema),
    defaultValues: category ? { name: category.name, description: category.description ?? "", image: category.image ?? "" } : {},
  });
  const onSubmit = async (data: CatFormData) => {
    if (category) await updateCategory.mutateAsync({ id: category.id, data });
    else await createCategory.mutateAsync(data);
    reset();
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit Category" : "Add Category"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input id="cat-name" label="Name" placeholder="Category name" error={errors.name?.message} {...register("name")} />
        <Input id="cat-image" label="Image URL" placeholder="https://…" hint="Paste a hosted image URL" {...register("image")} />
        <Textarea id="cat-desc" label="Description" placeholder="Optional description…" {...register("description")} />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isSubmitting}>{category ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [editCat, setEditCat] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const filtered = (categories ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Categories</h1>
          <p className="text-sm text-on-surface-muted">{categories?.length ?? 0} categories</p>
        </div>
        <Button onClick={() => { setEditCat(undefined); setModalOpen(true); }}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-surface-high">
          <SearchInput value={search} onChange={setSearch} placeholder="Search categories…" className="max-w-sm" />
        </div>
        <div className="overflow-x-auto">
          {isError ? <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>
            : isLoading ? <div className="p-6"><TableSkeleton rows={4} /></div>
            : filtered.length === 0 ? <EmptyState title="No categories found" icon="categories" action={{ label: "Add Category", onClick: () => setModalOpen(true) }} />
            : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-low text-left">
                    {["Image","Name","Description","Products","Created","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-on-surface-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0edef]">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f9f7f8] transition-colors">
                      <td className="px-5 py-3">
                        {c.image ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote supabase image
                          <img src={c.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <span className="w-9 h-9 rounded-lg block" style={{ background: stringToGradient(c.id) }} />
                        )}
                      </td>
                      <td className="px-5 py-3 font-semibold text-on-surface">{c.name}</td>
                      <td className="px-5 py-3 text-on-surface-muted max-w-xs truncate">{c.description ?? "—"}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{c._count?.products ?? "—"}</td>
                      <td className="px-5 py-3 text-on-surface-muted whitespace-nowrap">{formatDate(c.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => { setEditCat(c); setModalOpen(true); }} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"><Pencil size={14} /></button>
                          <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-on-surface-muted hover:bg-error-container hover:text-error rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      <CategoryFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditCat(undefined); }} category={editCat} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { if (deleteId) { await deleteCategory.mutateAsync(deleteId); setDeleteId(null); } }} message="This will soft-delete the category." loading={deleteCategory.isPending} />
    </div>
  );
}
