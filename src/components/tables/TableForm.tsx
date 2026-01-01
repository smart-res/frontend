import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Users, MapPin, AlignLeft, CheckCircle2, AlertCircle } from 'lucide-react'; 
import type { Table } from '../../types/tables';
import toast from "react-hot-toast";

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
  status: 'active' | 'inactive'| 'occupied',
  description?: string,
}

const LOCATIONS = ['Indoor', 'Outdoor', 'Patio', 'VIP Room', 'Main Hall'];

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
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError('tableNumber', {
          type: 'manual',
          message: err.response.data.message || 'Table number already exists',
        })
      } else {
        toast.error('Failed to save table');
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {initialData ? 'Update Table' : 'Create New Table'}
            </h2>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Configuration Panel</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-5">
          
          {/* Table Number & Capacity Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Table Identifier *
              </label>
              <input
                placeholder="e.g. T-101"
                className={`w-full bg-slate-50 border ${errors.tableNumber ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100'} rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:border-emerald-500 transition-all`}
                {...register('tableNumber', { required: 'Table number is required' })}
              />
              {errors.tableNumber && 
                <p className="text-red-500 text-xs font-semibold mt-1 px-1">
                  <AlertCircle size={12} />{errors.tableNumber.message}
                </p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Seats *
              </label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  {...register('capacity', {
                    required: 'Capacity is required',
                    min: {
                      value: 1,
                      message: 'Capacity must be at least 1',
                    },
                    max: {
                      value: 20,
                      message: 'Capacity must be at most 20',
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
              {errors.capacity && 
                <p className="text-red-500 text-xs font-semibold mt-1 px-1">
                  <AlertCircle size={12} />{errors.capacity.message}
                </p>}
            </div>
          </div>

          {/* Location & Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Zone / Area</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none appearance-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  {...register('location', { required: true })}
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Visibility</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                {...register('status')}
              >
                <option value="active">Active</option>
                <option value="occupied">Occupied</option>
                <option value="inactive" disabled={initialData?.status === 'occupied'}>Inactive</option>
              </select>
            </div>
          </div>

          {selectedLocation === 'Custom' && (
            <div className="animate-in slide-in-from-top-1 duration-200">
              <input
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500"
                placeholder="Type custom zone name..."
                {...register('location', { required: 'Custom location is required' })}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Internal Notes</label>
            <div className="relative">
              <AlignLeft size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                rows={2}
                placeholder="Optional notes for staff..."
                {...register('description')}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {initialData ? 'Update Table' : 'Confirm & Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TableForm;