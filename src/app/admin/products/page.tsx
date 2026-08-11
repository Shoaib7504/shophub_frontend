"use client";

import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { TableSkeleton } from "@/components/ui/Skeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { formatPrice, formatDate, stringToGradient } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});
type ProductFormData = z.infer<typeof productSchema>;

function ProductFormModal({
  open, onClose, product,
}: {
  open: boolean; onClose: () => void; product?: Product;
}) {
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    // @ts-expect-error Zod coerce resolver type mismatch
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { title: product.title, description: product.description ?? "", image: product.image ?? "", price: product.price, stock: product.stock, categoryId: product.categoryId, status: product.status }
      : { status: "ACTIVE", stock: 0, price: 0 },
  });

  const onSubmit = async (formData: ProductFormData) => {
    if (product) {
      await updateProduct.mutateAsync({ id: product.id, data: formData as UpdateProductInput });
    } else {
      await createProduct.mutateAsync(formData as CreateProductInput);
    }
    reset();
    onClose();
  };

  const catOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "Add Product"} size="lg">
      <form onSubmit={handleSubmit((values) => onSubmit(values as unknown as ProductFormData))} className="space-y-4">
        <Input id="title" label="Title" placeholder="Product name" error={errors.title?.message} {...register("title")} />
        <Input id="image" label="Image URL" placeholder="https://…" hint="Paste a hosted image URL" {...register("image")} />
        <Textarea id="description" label="Description" placeholder="Product description…" {...register("description")} />
        <div className="grid grid-cols-2 gap-3">
          <Input id="price" label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register("price")} />
          <Input id="stock" label="Stock" type="number" error={errors.stock?.message} {...register("stock")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select id="categoryId" label="Category" options={catOptions} placeholder="Select category" error={errors.categoryId?.message} {...register("categoryId")} />
          <Select id="status" label="Status" options={statusOptions} error={errors.status?.message} {...register("status")} />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isSubmitting}>
            {product ? "Update" : "Create"} Product
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const LIMIT = 10;

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useProducts({ search, page, limit: LIMIT, status: "ALL" });
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProduct.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Products</h1>
          <p className="text-sm text-[#76777d]">{data?.total ?? 0} products total</p>
        </div>
        <Button onClick={() => { setEditProduct(undefined); setModalOpen(true); }}>
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-[#eae7e9]">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products…" className="max-w-sm" />
        </div>

        <div className="overflow-x-auto">
          {isError ? (
            <div className="p-6"><ErrorState onRetry={() => refetch()} /></div>
          ) : isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : !data || data.products.length === 0 ? (
            <EmptyState title="No products found" icon="products" action={{ label: "Add Product", onClick: () => setModalOpen(true) }} />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f6f3f5] text-left">
                  {["Title","Category","Price","Stock","Status","Created","Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-[#76777d] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0edef]">
                {data.products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f9f7f8] transition-colors">
                    <td className="px-5 py-3 font-medium text-[#1b1b1d] max-w-xs truncate">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote supabase image
                          <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <span className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: stringToGradient(p.id) }} />
                        )}
                        <span className="truncate">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#76777d]">{p.category?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-bold text-[#0f172a] font-[family-name:var(--font-geist)] whitespace-nowrap">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3 text-[#45464d]">{p.stock}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-[#76777d] whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditProduct(p); setModalOpen(true); }} className="p-1.5 text-[#45464d] hover:bg-[#f0edef] hover:text-[#0f172a] rounded-lg transition-all" aria-label="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-[#76777d] hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-lg transition-all" aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
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

      <ProductFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditProduct(undefined); }} product={editProduct} />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This will soft-delete the product and hide it from the storefront."
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
