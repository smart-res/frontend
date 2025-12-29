import { QrCode, Edit2, Power, Users, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Table } from '../../types/tables';

interface TableTileProps {
  table: Table;
  onGetQR: (table: Table) => void;
  onEdit: (table: Table) => void;
  onToggleStatus: (table: Table) => void;
}

const TableTile = ({
  table,
  onGetQR,
  onEdit,
  onToggleStatus,
}: TableTileProps) => {
  const { tableNumber, status, capacity, location } = table;
  const isActive = status === 'active';
  const isOccupied = status === 'occupied';

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 
      ${(isActive || isOccupied)
        ? 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50' 
        : 'bg-slate-50 border-slate-200 grayscale-[0.6] opacity-80'}`}
    >
      {/* Top Status Accent Bar */}
      <div className={`h-1.5 w-full ${isActive ? 'bg-emerald-500' : isOccupied ? 'bg-[#E2B13C]' : 'bg-slate-300'}`} />

      <div className="p-5 space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Designation
            </span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-0.5">
              Table {tableNumber}
            </h3>
          </div>
          
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
              ${
                isActive
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : isOccupied
                  ? 'bg-[#E2B13C]/10 border-[#E2B13C]/30 text-[#E2B13C]'
                  : 'bg-slate-200 border-slate-300 text-slate-600'
              }`}
          >
            {isActive ? (
              <CheckCircle2 size={10} />
            ) : isOccupied ? (
              <AlertCircle size={10} />
            ) : (
              <AlertCircle size={10} />
            )}
            {status}
          </div>
        </div>

        {/* Info Grid */}
        
        <div className="flex items-center gap-4 py-3 border-y border-slate-100/60">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                <Users size={14} />
            </div>
            <span className="text-sm font-bold text-slate-700">{capacity} <span className="text-slate-400 font-medium text-xs">seats</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                <MapPin size={14} />
            </div>
            <span className="text-sm font-semibold text-slate-500 truncate max-w-[80px]">{location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {(isActive || isOccupied) && (
            <button
              onClick={() => onGetQR(table)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md active:scale-95"
            >
              <QrCode size={14} />
              QR CODE
            </button>
          )}

          <button
            onClick={() => onEdit(table)}
            className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            title="Edit Configuration"
          >
            <Edit2 size={16} />
          </button>

          <button
            disabled={isOccupied}
            onClick={() => onToggleStatus(table)}
            className={`p-2.5 rounded-xl border transition-all shadow-sm ${
              isOccupied
                ? 'bg-[#E2B13C]/20 border-[#E2B13C]/30 text-[#E2B13C] cursor-not-allowed'
                : isActive
                ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white'
                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
            title={
              isOccupied
                ? 'Table is currently occupied'
                : isActive
                ? 'Deactivate Table'
                : 'Activate Table'
            }
          >
            <Power size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableTile;