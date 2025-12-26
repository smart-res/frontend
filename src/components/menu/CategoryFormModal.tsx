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
      title={mode === "create" ? "Create Category" : "Edit Category"}
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => onSubmit(values))}
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 50, message: "Max 50 characters" },
              onChange: () => {
                if (errors.name?.type === "server") clearErrors("name");
              },
            })}
            placeholder="e.g. Burgers"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            rows={3}
            {...register("description", {
              maxLength: { value: 500, message: "Too long" },
            })}
            placeholder="Optional"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Display order</label>
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              {...register("displayOrder", {
                valueAsNumber: true,
                min: { value: 0, message: "Must be non-negative" },
              })}
            />
            {errors.displayOrder && (
              <p className="mt-1 text-sm text-red-600">
                {errors.displayOrder.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              {...register("status", { required: true })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!!loading}
            type="submit"
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
