import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getCustomerMenu } from "../../api/customer/menu";
import type { CustomerMenuResponse } from "../../api/customer/menu";
import {
  AlignJustify,
  Search,
  Home,
  ShoppingCart,
  ClipboardList,
  User2,
  Star,
  Utensils,
} from "lucide-react";
import { fileUrl } from "../../utils/fileUrl";

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function Stars({ value = 5 }: { value?: number }) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="inline-flex items-center gap-0.5 text-orange-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < n && "fill-current")} />
      ))}
    </span>
  );
}

export default function CustomerMenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const [data, setData] = useState<CustomerMenuResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const chipScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      getCustomerMenu({
        q: search || undefined,
        categoryId: activeCategoryId !== "all" ? activeCategoryId : undefined,
        page: 1,
        limit: 50,
        sort: "createdAt",
      })
        .then(setData)
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(t);
  }, [search, activeCategoryId]);

  const categories = useMemo(() => {
    const base = data?.categories ?? [];
    return [{ id: "all", name: "All", displayOrder: -999 }, ...base];
  }, [data]);

  const items = useMemo(() => {
    const all = data?.items ?? [];
    const s = search.trim().toLowerCase();
    let filtered = s ? all.filter((it) => (it.name ?? "").toLowerCase().includes(s)) : all;

    if (activeCategoryId !== "all") {
      const hasCat = filtered.some((it) => typeof (it as any).categoryId === "string");
      if (hasCat) filtered = filtered.filter((it: any) => it.categoryId === activeCategoryId);
    }
    return filtered;
  }, [data, search, activeCategoryId]);

  return (
    <div className="min-h-[100svh] bg-[#EEF1F5] flex flex-col">
      <div className="mx-auto w-full max-w-[420px] py-4 flex flex-col flex-1">
        {/* Header */}
        <div className="rounded-t-[28px] bg-[#E64B3C] px-4 pt-4 pb-5">
          <div className="relative flex items-center justify-center">
            <button
              className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white"
              type="button"
              aria-label="Open menu"
            >
              <AlignJustify className="h-5 w-5" />
            </button>

            <h1 className="text-white text-lg font-semibold">Smart Restaurant</h1>

            <div className="absolute right-0 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white">
              Customer
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* White content */}
        <div className="bg-white px-4 pt-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] flex flex-col flex-1">
          {/* Category sticky */}
          <div className="sticky top-0 z-30 bg-white pt-2">
            <div
              ref={chipScrollRef}
              className={cn(
                "w-full",
                "flex gap-3 overflow-x-auto pb-3",
                "touch-pan-x overscroll-x-contain"
              )}
            >
              {categories.map((c) => {
                const active = c.id === activeCategoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategoryId(c.id)}
                    className={cn(
                      "shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition",
                      active ? "bg-[#E64B3C] text-white shadow-sm" : "bg-[#EEF2F6] text-gray-700"
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="mt-5 flex-1 pb-[104px] space-y-4">
            {loading && (
              <div className="rounded-2xl bg-[#F7F8FA] p-4 text-sm text-gray-500">
                Loading menu...
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="rounded-2xl bg-[#F7F8FA] p-4 text-sm text-gray-500">
                No items found.
              </div>
            )}

            {items.map((it) => (
              <MenuCard
                key={it.id}
                name={it.name}
                description={it.description}
                price={it.price}
                canOrder={it.canOrder}
                photoUrl={it.primaryPhotoUrl ? fileUrl(it.primaryPhotoUrl) : null}
                rating={5}
                reviews={Math.floor(10 + (Number(it.price) % 25))}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNavFixed cartCount={2} />
    </div>
  );
}

function MenuCard(props: {
  name: string;
  description?: string;
  price: number;
  canOrder: boolean;
  photoUrl: string | null;
  rating: number;
  reviews: number;
}) {
  const { name, description, price, canOrder, photoUrl, rating, reviews } = props;

  return (
    <div className="rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex overflow-hidden rounded-2xl">
        <div className="relative h-[110px] w-[110px] shrink-0 bg-gradient-to-b from-indigo-500 to-purple-700">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/80">
              <Utensils className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="flex-1 px-4 py-4">
          <div className="truncate text-[17px] font-semibold text-slate-800">{name}</div>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <Stars value={rating} />
            <span className="text-orange-500">({reviews} reviews)</span>
          </div>

          <div className="mt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available
            </span>
          </div>

          {description ? (
            <div className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">
              {description}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xl font-bold text-[#E64B3C]">${price.toFixed(2)}</div>

            <button
              type="button"
              disabled={!canOrder}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition active:scale-[0.99]",
                canOrder ? "bg-[#E64B3C] text-white" : "bg-gray-200 text-gray-500"
              )}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNavFixed({ cartCount }: { cartCount: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="bg-white shadow-[0_-10px_28px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-around px-4 py-3">
            <NavTab to="/customer/menu" label="Menu" icon={<Home className="h-6 w-6" />} end />
            <NavTab
              to="/customer/cart"
              label="Cart"
              icon={
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E64B3C] px-1 text-[11px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
              }
            />
            <NavTab to="/customer/orders" label="Orders" icon={<ClipboardList className="h-6 w-6" />} />
            <NavTab to="/customer/profile" label="Profile" icon={<User2 className="h-6 w-6" />} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavTab(props: { to: string; label: string; icon: React.ReactNode; end?: boolean }) {
  return (
    <NavLink
      to={props.to}
      end={props.end}
      className={({ isActive }) =>
        cn("flex w-1/4 flex-col items-center gap-1", isActive ? "text-[#E64B3C]" : "text-slate-500")
      }
    >
      <div>{props.icon}</div>
      <div className="text-xs">{props.label}</div>
    </NavLink>
  );
}
