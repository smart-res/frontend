import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Table } from '../../types/tables';

interface TableFormProps {
  open: boolean,
  onClose: () => void,
  onSubmit: (data: TableFormData) => Promise<void>,
  existingTables?: Table[],
  initialData?: Partial<Table>,
}

export interface TableFormData {
  tableNumber: string,
  capacity: number,
  location: string,
  status: 'active' | 'inactive',
  description?: string,
}

const LOCATIONS = ['Indoor', 'Outdoor', 'Patio', 'VIP Room', 'Custom'];

const TableForm: React.FC<TableFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TableFormData>({
    defaultValues: {
      tableNumber: '',
      capacity: 2,
      location: 'Indoor',
      status: 'active',
      description: '',
    },
  });

  const selectedLocation = watch('location');

  useEffect(() => {
    if (open) {
      reset({
        tableNumber: initialData?.tableNumber ?? '',
        capacity: initialData?.capacity ?? 2,
        location: initialData?.location ?? 'Indoor',
        status: initialData?.status ?? 'active',
        description: initialData?.description ?? '',
      });
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  const submitHandler = async (data: TableFormData) => {
    try {
      await onSubmit(data)
      onClose()
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError('tableNumber', {
          type: 'manual',
          message: err.response.data.message || 'Table number already exists',
        })
      } else {
        alert('Failed to save table')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {initialData ? 'Edit Table' : 'Add New Table'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Table Number / Name *
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              {...register('tableNumber', {
                required: 'Table number is required',
              })}
            />
            {errors.tableNumber && (
              <p className="text-red-500 text-sm">
                {errors.tableNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Capacity (Seats) *
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              {...register('capacity', {
                required: 'Capacity is required',
                min: { value: 1, message: 'Minimum is 1 seat' },
                max: { value: 20, message: 'Maximum is 20 seats' },
                valueAsNumber: true,
              })}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Location / Zone *</label>
            <select
              className="w-full border rounded px-3 py-2"
              {...register('location', { required: true })}
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {selectedLocation === 'Custom' && (
              <input
                className="w-full border rounded px-3 py-2 mt-2"
                placeholder="Enter custom location"
                {...register('location', {
                  required: 'Custom location is required',
                })}
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2"
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TableForm;
