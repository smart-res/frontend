import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal";
import type { ItemStatus, MenuItem } from "../../types/menuItem";
import type { MenuCategory } from "../../types/menu";
import { getCategoryId } from "../../utils/getCategoryId";
import { AlertCircle, Star } from "lucide-react";

type FormValues = {
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  prepTimeMinutes?: number;
  status: ItemStatus;
  isChefRecommended?: boolean;
};

export function ItemFormModal({
  open,
  mode,
  initial,
  categories,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial: MenuItem | null;
  categories: MenuCategory[];
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void> | void;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      categoryId: "",
      price: 1,
      description: "",
      prepTimeMinutes: 0,
      status: "available",
      isChefRecommended: false,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: initial?.name ?? "",
      categoryId: getCategoryId(initial?.categoryId),
      price: initial?.price ?? 1,
      description: initial?.description ?? "",
      prepTimeMinutes: initial?.prepTimeMinutes ?? 0,
      status: initial?.status ?? "available",
      isChefRecommended: initial?.isChefRecommended ?? false,
    });
  }, [open, initial?._id, reset]);

  const inputClasses = `
    w-full rounded-2xl border-gray-200 bg-gray-50 px-4 py-3 text-sm 
    outline-none transition-all duration-200 
    focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10
  `;

  const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1";

  return (
    <Modal
      open={open}
      title={mode === "create" ? "✨ Create New Dish" : "📝 Edit Menu Item"}
      onClose={onClose}
    >
      <form
        className="flex flex-col h-full max-h-[85vh]" 
        onSubmit={handleSubmit((v) => onSubmit(v))}
      >
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar min-h-0">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Dish Name</label>
              <div className="relative">
                <input
                  placeholder="e.g. Wagyu Beef Burger"
                  className={`${inputClasses} ${errors.name ? "border-red-300 ring-red-500/10" : ""}`}
                  {...register("name", {
                    required: "What is the name of this dish?",
                    minLength: { value: 2, message: "Name is too short" },
                    maxLength: { value: 80, message: "Name is too long" },
                  })}
                />
                {errors.name && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500 ml-1">
                    <AlertCircle size={14} />
                    {errors.name.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Category</label>
                <select className={inputClasses} {...register("categoryId", { required: "Pick a category" })}>
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Price ($)</label>
                <div className="relative flex items-center">
                   <span className="absolute left-4 text-gray-400 text-sm">$</span>
                   <input
                    type="number"
                    step="0.01"
                    className={`${inputClasses} pl-8`}
                    {...register("price", {
                      valueAsNumber: true,
                      min: { value: 0.01, message: "Price > 0" },
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-50/50 p-5 space-y-4 border border-gray-100">
            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                rows={3}
                placeholder="Tell your customers about this delicious dish..."
                className={`${inputClasses} bg-white`}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Prep Time (Min)</label>
                <div className="relative">
                  <input
                    type="number"
                    className={`${inputClasses} bg-white`}
                    {...register("prepTimeMinutes", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Availability</label>
                <select className={`${inputClasses} bg-white font-medium`} {...register("status")}>
                  <option value="available">🟢 Available</option>
                  <option value="unavailable">⚪ Unavailable</option>
                  <option value="sold_out">🟠 Sold out</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-100 group transition-all hover:bg-indigo-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Star className={`transition-colors ${initial?.isChefRecommended ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">Chef's Recommendation</p>
                <p className="text-xs text-indigo-600/70">Featured item on menu</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register("isChefRecommended")} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 px-4 py-3.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              disabled={!!loading}
              type="submit"
              className="flex-[2] rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </div>
              ) : (
                "Save Menu Item"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}