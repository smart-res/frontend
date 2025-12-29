import type { ReactNode } from "react";

type StatsVariant = 'total' | 'active' | 'inactive';

export interface StatsCardProps {
  label: string;
  value: number;
  variant: StatsVariant;
  icon?: ReactNode;
}

const variantConfig: Record<
  StatsVariant,
  { icon: string; bg: string; text: string }
> = {
  total: {
    icon: '🪑',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  active: {
    icon: '✅',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  inactive: {
    icon: '🚫',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
}

const StatsCard = ({ label, value, variant, icon }: StatsCardProps) => {
  const config = variantConfig[variant];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div
        className={`text-2xl p-4 rounded-xl ${config.bg} ${config.text} flex items-center justify-center`}
      >
        {icon ? icon : config.icon}
      </div>

      <div>
        <div className="text-2xl font-extrabold text-slate-900 leading-none">{value}</div>
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-tight mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;