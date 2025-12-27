import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import type { MenuItem } from "../../types/menuItem";
import type { MenuItemPhoto } from "../../types/menuItemPhoto";
import {
  getItemPhotos,
  uploadItemPhotos,
  removeItemPhoto,
  setPrimaryItemPhoto,
} from "../../api/admin/menuItemPhoto";
import { fileUrl } from "../../utils/fileUrl";
import { UploadCloud, Trash2, Star, CheckCircle2, XCircle, ImageIcon, Loader2 } from "lucide-react";

export function ItemPhotosModal({
  open,
  item,
  onClose,
}: {
  open: boolean;
  item: MenuItem | null;
  onClose: () => void;
}) {
  const [photos, setPhotos] = useState<MenuItemPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const itemId = item?._id;

  async function refresh() {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await getItemPhotos(itemId);
      setPhotos(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load photos");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setPhotos([]);
      setError(null);
      return;
    }
    if (itemId) refresh();
  }, [open, itemId]);

  async function handleUpload(files: FileList) {
    if (!itemId || !files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const list = await uploadItemPhotos(itemId, Array.from(files));
      setPhotos(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove(photoId: string) {
    if (!itemId) return;
    setError(null);
    try {
      await removeItemPhoto(itemId, photoId);
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Remove failed");
    }
  }

  async function handlePrimary(photoId: string) {
    if (!itemId) return;
    setError(null);
    try {
      await setPrimaryItemPhoto(itemId, photoId);
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Set primary failed");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      onClose();
    } catch (e: any) {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || uploading || saving;

  return (
    <Modal 
      open={open} 
      title={`🖼 Gallery: ${item?.name ?? "Item"}`} 
      onClose={onClose}
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        {error && (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
            <XCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar min-h-0">
          
          <div 
            onClick={() => fileRef.current?.click()}
            className={`
              relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 
              transition-all duration-200 flex flex-col items-center justify-center gap-3
              ${uploading ? "bg-gray-50 border-gray-200 pointer-events-none" : "hover:bg-indigo-50/50 hover:border-indigo-300 border-gray-200"}
            `}
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
            
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <p className="text-sm font-semibold text-gray-600">Uploading your photos...</p>
              </>
            ) : (
              <>
                <div className="p-4 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">Click here to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP up to 5MB</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Manage Photos ({photos.length})
              </h4>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400 font-medium">No photos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((p) => (
                  <div
                    key={p._id}
                    className={`
                      group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300
                      ${p.isPrimary ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg" : "border-gray-100 hover:border-indigo-200"}
                    `}
                  >
                    <img
                      src={fileUrl(p.url)}
                      className="h-full w-full object-cover"
                      alt=""
                    />

                    {p.isPrimary && (
                      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        <CheckCircle2 size={12} />
                        Main Photo
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      {!p.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handlePrimary(p._id)}
                          className="p-2 bg-white rounded-xl text-amber-500 hover:bg-amber-50 transition-colors shadow-xl"
                          title="Set as Main Photo"
                          disabled={busy}
                        >
                          <Star size={18} fill={p.isPrimary ? "currentColor" : "none"} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(p._id)}
                        className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-xl"
                        title="Delete Photo"
                        disabled={busy}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
          <button
            type="button"
            onClick={handleSave}
            disabled={!itemId || busy}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? "Updating Gallery..." : "Done & Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}