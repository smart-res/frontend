import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  Edit2,
  Power,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from "lucide-react";

import {
  createAdminCategory,
  getAdminCategories,
  patchAdminCategoryStatus,
  updateAdminCategory,
} from "../../api/admin/menu";
import type { CategoryStatus, MenuCategory } from "../../types/menu";
import { CategoryFormModal } from "../../components/menu/CategoryFormModal";

const LIMIT_OPTIONS = [10, 20, 50];

export default function MenuCategories() {
  const [rows, setRows] = useState<MenuCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<CategoryStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"displayOrder" | "name" | "createdAt">("displayOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [formError, setFormError] = useState<{ field?: "name"; message: string } | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminCategories({ q: q || undefined, status, sortBy, sortDir, page, limit });
      setRows(res.items);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [q, status, sortBy, sortDir, page, limit]);

  function openCreate() { 
    setFormError(null);
    setModalMode("create"); 
    setEditing(null); 
    setModalOpen(true); 
  }
  function openEdit(cat: MenuCategory) { 
    setFormError(null);
    setModalMode("edit"); 
    setEditing(cat); 
    setModalOpen(true); 
  }

  async function handleSave(values: any) {
    setLoading(true);
    setError(null);
    setFormError(null);
    try {
      if (modalMode === "create") await createAdminCategory(values);
      else if (editing?._id) await updateAdminCategory(editing._id, values);
      setModalOpen(false);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Save failed";
      const status = e?.response?.status;

      if (status === 409 && /exists|already/i.test(msg)) {
        setFormError({ field: "name", message: msg });
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(cat: MenuCategory) {
    const next: CategoryStatus = cat.status === "active" ? "inactive" : "active";
    setRows((prev) => prev.map((r) => (r._id === cat._id ? { ...r, status: next } : r)));
    try {
      await patchAdminCategoryStatus(cat._id, next);
    } catch (e: any) {
      setRows((prev) => prev.map((r) => (r._id === cat._id ? cat : r)));
      setError(e?.response?.data?.message ?? "Failed to change status");
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Menu Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your menu structure and visibility settings.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-200 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-12">
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Search categories..."
            className="w-full rounded-xl border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm transition-focus focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value as any); }}
            className="w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-focus focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-2 md:col-span-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-focus focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="displayOrder">Sort by: Order</option>
            <option value="name">Sort by: Name</option>
            <option value="createdAt">Sort by: Date</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowUpDown size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 font-semibold text-gray-600">Category Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Visibility</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Order</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-6 h-16 bg-gray-50/30" />
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={4}>
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <LayoutGrid size={40} strokeWidth={1} />
                      <p>No categories found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((cat) => (
                  <tr key={cat._id} className="group transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{cat.name}</div>
                      {cat.description && (
                        <div className="mt-0.5 text-xs text-gray-400 line-clamp-1 max-w-[200px]">{cat.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                          cat.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        <span 
                          className={`h-1.5 w-1.5 rounded-full ${
                            cat.status === "active" ? "bg-emerald-500" : "bg-red-500"
                          }`} 
                        />
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                        {cat.displayOrder ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(cat)}
                          className={`p-2 rounded-lg transition-all ${
                            cat.status === "active" 
                            ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={cat.status === "active" ? "Deactivate" : "Activate"}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{rows.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{total}</span> results
          </p>

          <div className="flex items-center gap-4">
            <select
              value={limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
              className="rounded-lg border-gray-200 py-1.5 pl-2 pr-8 text-xs font-medium focus:ring-indigo-500 shadow-sm"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-4 text-xs font-bold text-gray-700">
                {page} <span className="text-gray-400 mx-1">/</span> {totalPages}
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CategoryFormModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        loading={loading}
        serverFieldError={formError}
      />
    </div>
  );
}