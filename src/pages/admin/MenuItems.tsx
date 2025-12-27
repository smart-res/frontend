import { useEffect, useMemo, useState } from "react";
import type { MenuItem, ItemStatus } from "../../types/menuItem";
import { getAdminItems, createAdminItem, updateAdminItem, deleteAdminItem } from "../../api/admin/menuItem";
import { getAdminCategories } from "../../api/admin/menu";
import type { MenuCategory } from "../../types/menu";
import { ItemFormModal } from "../../components/menu/ItemFormModal";
import { fileUrl } from "../../utils/fileUrl";
import { ItemPhotosModal } from "../../components/menu/ItemPhotosModal";
import { ItemModifiersModal } from "../../components/menu/ItemModifiersModal";
import { Search, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, Package, Clock, Tag } from "lucide-react";

const LIMIT_OPTIONS = [12, 24, 48];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  unavailable: { label: "Unavailable", color: "bg-gray-100 text-gray-600 border-gray-200" },
  sold_out: { label: "Sold Out", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

type SortKey = "createdAt" | "price" | "popularity";

export default function MenuItems() {
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [status, setStatus] = useState<ItemStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [cats, setCats] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<MenuItem | null>(null);

  const [photosOpen, setPhotosOpen] = useState(false);
  const [photoItem, setPhotoItem] = useState<MenuItem | null>(null);

  const [modsOpen, setModsOpen] = useState(false);
  const [modsItemId, setModsItemId] = useState<string | null>(null);

  function openPhotos(item: MenuItem) {
    setPhotoItem(item);
    setPhotosOpen(true);
  }

  function openMods(it: MenuItem) {
    setModsItemId(it._id);
    setModsOpen(true);
  }

  async function closeMods() {
    setModsOpen(false);
    setModsItemId(null);
    await load();
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  async function loadCats() {
    const res = await getAdminCategories({ status: "all", sortBy: "displayOrder", sortDir: "asc", page: 1, limit: 200 });
    const list = (res as any).items ?? (res as any);
    setCats(Array.isArray(list) ? list : []);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminItems({
        name: name.trim() ? name.trim() : undefined,
        categoryId: categoryId === "all" ? undefined : categoryId,
        status: status === "all" ? undefined : status,
        sort,
        order,
        page,
        limit,
      });

      setRows(res.items);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function closePhotosModal() {
    setPhotosOpen(false);
    setPhotoItem(null);
    await load();
  }

  useEffect(() => {
    loadCats().catch(() => {});
  }, []);

  useEffect(() => {
    if (categoryId === "all") return;
    const selected = cats.find((c) => c._id === categoryId);
    if (selected && selected.status !== "active") {
      setCategoryId("all");
      setPage(1);
    }
  }, [cats, categoryId]);

  useEffect(() => {
    load();
  }, [name, categoryId, status, sort, order, page, limit]);

  function openCreate() {
    setModalMode("create");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setModalMode("edit");
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSave(values: any): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      if (modalMode === "create") {
        await createAdminItem(values);
      } else {
        if (!editing?._id) throw new Error("Missing item id");
        await updateAdminItem(editing._id, values);
      }

      setModalOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Save failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteAdminItem(item._id);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Delete failed");
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Menu Management</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage your dishes, prices, and availability.</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-medium shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          type="button"
        >
          <Plus size={20} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-400 pb-2 border-b border-gray-50">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-semibold uppercase tracking-wider">Filters & Sorting</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={name}
              onChange={(e) => { setPage(1); setName(e.target.value); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="Search by name..."
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryId}
              onChange={(e) => { setPage(1); setCategoryId(e.target.value); }}
              className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {cats.filter((c) => c.status === "active").map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value as any); }}
              className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
            >
              <option value="all">Any Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <select
              value={sort}
              onChange={(e) => { setPage(1); setSort(e.target.value as any); }}
              className="flex-1 px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
            >
              <option value="createdAt">Date Added</option>
              <option value="price">Price Level</option>
              <option value="popularity">Popularity</option>
            </select>
            <button
              onClick={() => setOrder((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-4 py-2.5 bg-gray-50 border-transparent rounded-xl hover:bg-gray-100 transition-colors"
            >
              {order === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          {error}
        </div>
      )}

      {/* Grid List */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No menu items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map((it) => {
              const catName = typeof it.categoryId === "object" ? it.categoryId.name : "Uncategorized";
              const statusInfo = STATUS_CONFIG[it.status] || STATUS_CONFIG.available;

              return (
                <div key={it._id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Image Holder */}
                  <div 
                    className="relative h-48 w-full overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => openPhotos(it)}
                  >
                    {it.primaryPhoto ? (
                      <img
                        src={fileUrl(it.primaryPhoto)}
                        alt={it.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-2">
                        <Plus size={24} className="opacity-50" />
                        <span className="text-xs font-medium italic">Click to add photos</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                       <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg border ${statusInfo.color} backdrop-blur-md bg-opacity-90`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{it.name}</h3>
                        <div className="flex items-center gap-1.5 text-indigo-500 mt-0.5">
                          <Tag size={12} />
                          <span className="text-xs font-medium">{catName}</span>
                        </div>
                      </div>
                      <div className="text-xl font-black text-gray-900">${it.price.toFixed(2)}</div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-2 flex-1 leading-relaxed">
                      {it.description || "No description provided for this item."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock size={14} />
                        <span>{it.prepTimeMinutes ?? 0} mins</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openMods(it)}
                        className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
                      >
                        Modifiers
                      </button>
                      <button
                        onClick={() => openEdit(it)}
                        className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(it)}
                        className="col-span-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1"
                      >
                        Delete Item
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{rows.length}</span> of <span className="font-semibold text-gray-900">{total}</span> items
        </p>

        <div className="flex items-center gap-3">
          <select
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            className="bg-white border-gray-200 rounded-lg text-sm focus:ring-indigo-500 outline-none py-1.5 pl-2 pr-8"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 border-x border-gray-100 text-sm font-bold min-w-[60px] text-center">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <ItemFormModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        loading={loading}
        categories={cats.filter((c) => c.status === "active")}
      />

      <ItemPhotosModal
        open={photosOpen}
        item={photoItem}
        onClose={closePhotosModal}
      />

      <ItemModifiersModal 
        open={modsOpen} 
        itemId={modsItemId} 
        onClose={closeMods} 
      />
    </div>
  );
}
