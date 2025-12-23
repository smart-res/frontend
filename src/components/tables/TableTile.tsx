import type { Table } from '../../types/tables';

interface TableTileProps {
  table: Table,
  onGenerateQR: (table: Table) => void,
  onEdit: (table: Table) => void,
  onToggleStatus: (table: Table) => void,
}

const TableTile = ({
  table,
  onGenerateQR,
  onEdit,
  onToggleStatus,
}: TableTileProps) => {
  const { tableNumber, status, capacity, location } = table;

  const statusConfig = {
    active: {
      label: 'Active',
      icon: '✅',
      color: 'bg-green-50 text-green-600',
    },
    inactive: {
      label: 'Inactive',
      icon: '🚫',
      color: 'bg-gray-100 text-gray-500',
    },
  }

  const config = statusConfig[status];

  return (
    <div className={`p-4 rounded shadow space-y-2 ${config.color}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          Table {tableNumber}
        </h3>
        <span className="text-sm font-semibold">
          {config.icon} {config.label}
        </span>
      </div>

      <div className="text-sm text-gray-600 flex justify-between">
        <span>{capacity} seats</span>
        <span>{location}</span>
      </div>

      <div className="flex gap-2 pt-2">
        {status === 'active' && (
          <button
            onClick={() => onGenerateQR(table)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
          >
            QR
          </button>
        )}

        <button
          onClick={() => onEdit(table)}
          className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
        >
          ✎
        </button>

        <button
          onClick={() => onToggleStatus(table)}
          className={`px-2 py-1 rounded text-sm text-white ${
            status === 'active'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  )
}

export default TableTile;
