import TableTile from './TableTile';
import type { Table } from '../../types/tables';

interface TablesGridProps {
  tables: Table[],
  onGenerateQR: (table: Table) => void,
  onEdit: (table: Table) => void,
  onToggleStatus: (table: Table) => void,
}

const TablesGrid = ({
  tables,
  onGenerateQR,
  onEdit,
  onToggleStatus,
}: TablesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map(table => (
        <TableTile
          key={table.id}
          table={table}
          onGenerateQR={onGenerateQR}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}

export default TablesGrid;
