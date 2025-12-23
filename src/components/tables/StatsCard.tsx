type StatsVariant = 'total' | 'active' | 'inactive';

interface StatsCardProps {
  label: string,
  value: number,
  variant: StatsVariant,
}

const variantConfig: Record<
  StatsVariant,
  { icon: string; bg: string; text: string }
> = {
  total: {
    icon: '🪑',
    bg: 'bg-teal-100',
    text: 'text-teal-600',
  },
  active: {
    icon: '✅',
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  inactive: {
    icon: '🚫',
    bg: 'bg-gray-200',
    text: 'text-gray-600',
  },
}

const StatsCard = ({ label, value, variant }: StatsCardProps) => {
  const config = variantConfig[variant];

  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <div
        className={`text-3xl p-3 rounded-full ${config.bg} ${config.text}`}
      >
        {config.icon}
      </div>

      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export default StatsCard;
