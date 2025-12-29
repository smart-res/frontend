import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal";
import type { CategoryStatus, MenuCategory } from "../../types/menu";

type FormValues = {
  name: string;
  description?: string;
  displayOrder?: number;
  status: CategoryStatus;
};

export function CategoryFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading,
  serverFieldError,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: MenuCategory | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void> | void;
  loading?: boolean;
  serverFieldError?: { field?: "name"; message: string } | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        displayOrder: initial?.displayOrder ?? 0,
        status: initial?.status ?? "active",
      });
      clearErrors();
    }
  }, [open, initial, reset, clearErrors]);

  useEffect(() => {
    if (!open) return;
    if (serverFieldError?.field === "name") {
      setError("name", { type: "server", message: serverFieldError.message });
    }
  }, [open, serverFieldError, setError]);

  return (
    <Modal
      open={open}
      title={mode === "create" ? "New Category" : "Edit Category"}
      onClose={onClose}
    >
      <form
        className="mt-2 space-y-8"
        onSubmit={handleSubmit(async (values) => onSubmit(values))}
      >
        {/* Section: Basic Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
             <span className="text-sm font-semibold text-slate-800">Basic Information</span>
          </div>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">Category Name</label>
              </div>
              <input
                className={`w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm transition-all outline-none
                  ${errors.name 
                    ? "border-red-300 ring-4 ring-red-50 focus:border-red-500" 
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  }`}
                {...register("name", {
                  required: "Category name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 50, message: "Max 50 characters" },
                  onChange: () => {
                    if (errors.name?.type === "server") clearErrors("name");
                  },
                })}
                placeholder="e.g. Signature Burgers"
              />
              <div className="mt-1.5 flex justify-between items-start">
                {errors.name ? (
                  <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                    {errors.name.message}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">Unique name for your menu section (2-50 chars)</p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                className={`w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm transition-all outline-none resize-none
                  ${errors.description 
                    ? "border-red-300 ring-4 ring-red-50 focus:border-red-500" 
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  }`}
                rows={3}
                {...register("description", {
                  maxLength: { value: 500, message: "Description too long" },
                })}
                placeholder="Tell customers about the items in this category..."
              />
              <div className="mt-1.5 flex justify-between">
                {errors.description && (
                  <p className="text-sm font-medium text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Settings */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
             <span className="text-sm font-semibold text-slate-800">Display Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Display Order</label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                {...register("displayOrder", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be 0 or more" },
                })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <div className="relative group">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer"
                  {...register("status", { required: true })}
                >
                  <option value="active" className="text-emerald-600">Active</option>
                  <option value="inactive" className="text-slate-500">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-focus-within:text-emerald-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="relative flex items-center justify-center min-w-[120px] px-6 py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </div>
            ) : (
              mode === "create" ? "Create Category" : "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}