import TableTile from './TableTile';
import type { Table } from '../../types/tables';
import { PlusCircle } from 'lucide-react';

interface TablesGridProps {
  tables: Table[],
  onGetQR: (table: Table) => void,
  onEdit: (table: Table) => void,
  onToggleStatus: (table: Table) => void,
}

const TablesGrid = ({
  tables,
  onGetQR,
  onEdit,
  onToggleStatus,
}: TablesGridProps) => {
  
  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <PlusCircle className="text-slate-300 w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">No tables configured</h3>
        <p className="text-slate-500 text-sm max-w-[280px] text-center mt-1">
          Start by adding your first restaurant table to generate a unique QR code.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map(table => (
        <TableTile
          key={table.id}
          table={table}
          onGetQR={onGetQR}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}

export default TablesGrid;