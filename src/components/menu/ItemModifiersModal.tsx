import { useEffect, useMemo, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "../Modal";
import type { ModifierGroup, ModifierOption, ModifierSelectionType, ModifierStatus } from "../../types/menuModifiers";
import { getAllModifierGroups, getModifierOptions, getAdminItemDetails } from "../../api/admin/menuModifiers.read";
import {
  createModifierGroup,
  createModifierOption,
  updateModifierOption,
  setItemModifierGroups,
  deleteModifierGroup,
  deleteModifierOption,
} from "../../api/admin/menuModifiers";
import { 
  Plus, 
  Trash2, 
  Settings2,
  CheckCircle2, 
  Link, 
  Unlink, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        value ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

type CreateGroupForm = {
  name: string;
  selectionType: ModifierSelectionType;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  displayOrder: number;
  status: ModifierStatus;
};

export function ItemModifiersModal({
  open,
  itemId,
  onClose,
}: {
  open: boolean;
  itemId: string | null;
  onClose: () => void | Promise<void>;
}) {
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [optionsMap, setOptionsMap] = useState<Record<string, ModifierOption[]>>({});
  const [attached, setAttached] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingAttach, setSavingAttach] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newOptName, setNewOptName] = useState("");
  const [newOptPrice, setNewOptPrice] = useState<number>(0);
  const [newOptStatus, setNewOptStatus] = useState<ModifierStatus>("active");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<CreateGroupForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      selectionType: "single",
      isRequired: false,
      minSelections: 0,
      maxSelections: 0,
      displayOrder: 0,
      status: "active",
    },
  });

  const selectionType = form.watch("selectionType");
  const isRequired = form.watch("isRequired");

  useEffect(() => {
    if (showCreate) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showCreate]);

  useEffect(() => {
    if (selectionType === "single") {
      form.setValue("minSelections", 0);
      form.setValue("maxSelections", 0);
    } else if (isRequired && form.getValues("minSelections") < 1) {
      form.setValue("minSelections", 1);
    }
  }, [selectionType, isRequired]);

  async function refresh() {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    try {
      const [allGroups, item] = await Promise.all([
        getAllModifierGroups("all"),
        getAdminItemDetails(itemId),
      ]);

      setGroups(allGroups);

      const groupIds: string[] = (item.modifierGroupIds ?? []).map((x: any) => String(x));
      setAttached(groupIds);

      const entries = await Promise.all(
        allGroups.map(async (g) => {
          const opts = await getModifierOptions(g._id, "all");
          return [g._id, opts] as const;
        })
      );
      setOptionsMap(Object.fromEntries(entries));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load modifiers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) refresh();
    else {
      setError(null);
      setGroups([]);
      setOptionsMap({});
      setAttached([]);
      setShowCreate(false);
      setAddingFor(null);
      setNewOptName("");
      setNewOptPrice(0);
      setNewOptStatus("active");
      form.reset();
    }
  }, [open, itemId]);

  async function toggleAttach(groupId: string) {
    if (!itemId) return;
    setSavingAttach(groupId);
    setError(null);
    try {
      const next = attached.includes(groupId)
        ? attached.filter((id) => id !== groupId)
        : [...attached, groupId];

      const res = await setItemModifierGroups(itemId, next);
      setAttached(res.modifierGroupIds ?? next);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Attach/detach failed");
    } finally {
      setSavingAttach(null);
    }
  }

  async function handleCreateGroup(values: CreateGroupForm) {
    const payload = {
      name: values.name.trim(),
      selectionType: values.selectionType,
      isRequired: values.isRequired,
      minSelections: values.selectionType === "multiple" ? values.minSelections : 0,
      maxSelections: values.selectionType === "multiple" ? values.maxSelections : 0,
      displayOrder: values.displayOrder ?? 0,
      status: values.status,
    };

    await createModifierGroup(payload);
    form.reset();
    setShowCreate(false);
    await refresh();
  }

  function openAddOption(groupId: string) {
    setAddingFor(groupId);
    setNewOptName("");
    setNewOptPrice(0);
    setNewOptStatus("active");
  }

  async function submitAddOption(groupId: string) {
    const name = newOptName.trim();
    if (!name) {
      setError("Option name is required");
      return;
    }

    setError(null);

    try {
      const created = await createModifierOption(groupId, {
        name,
        priceAdjustment: Number.isFinite(newOptPrice) ? Number(newOptPrice) : 0,
      });
      if (newOptStatus === "inactive" && created?._id) {
        await updateModifierOption(created._id, { status: "inactive" } as any);
      }

      const opts = await getModifierOptions(groupId, "all");
      setOptionsMap((m) => ({ ...m, [groupId]: opts }));

      setAddingFor(null);
      setNewOptName("");
      setNewOptPrice(0);
      setNewOptStatus("active");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Create option failed");
    }
  }

  async function patchOption(
    groupId: string, 
    optionId: string, 
    patch: Partial<ModifierOption>
  ) {
    await updateModifierOption(optionId, patch as any);
    const opts = await getModifierOptions(groupId, "all");
    setOptionsMap((m) => ({ ...m, [groupId]: opts }));
  }

  function removeGroup(groupId: string) {
    const g = groups.find((x) => x._id === groupId);
    openConfirm({
      type: "group",
      groupId,
      title: "Delete modifier group?",
      desc: `This will remove "${g?.name ?? "this group"}" and its options. This action can't be undone.`,
    });
  }

  function removeOption(groupId: string, optionId: string) {
    const opt = (optionsMap[groupId] ?? []).find((x) => x._id === optionId);
    openConfirm({
      type: "option",
      groupId,
      optionId,
      title: "Delete option?",
      desc: `Delete "${opt?.name ?? "this option"}"? This action can't be undone.`,
    });
  }

  const attachedSet = useMemo(() => new Set(attached), [attached]);

  // Handle confirm
  type ConfirmState =
    | null
    | { type: "group"; groupId: string; title: string; desc?: string }
    | { type: "option"; groupId: string; optionId: string; title: string; desc?: string };

  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirming, setConfirming] = useState(false);

  function openConfirm(next: ConfirmState) {
    setConfirmState(next);
  }

  async function handleConfirmDelete() {
    if (!confirmState) return;

    setConfirming(true);
    setError(null);

    try {
      if (confirmState.type === "group") {
        const groupId = confirmState.groupId;

        if (itemId && attached.includes(groupId)) {
          const next = attached.filter((id) => id !== groupId);
          const res = await setItemModifierGroups(itemId, next);
          setAttached(res.modifierGroupIds ?? next);
        }

        await deleteModifierGroup(groupId);
        await refresh();
      }

      if (confirmState.type === "option") {
        await deleteModifierOption(confirmState.optionId);
        const opts = await getModifierOptions(confirmState.groupId, "all");
        setOptionsMap((m) => ({ ...m, [confirmState.groupId]: opts }));
      }

      setConfirmState(null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Delete failed");
    } finally {
      setConfirming(false);
    }
  }

return (
    <Modal open={open} title="Manage Modifiers" onClose={onClose as any}>
      <div className="flex flex-col h-full max-h-[85vh]">
        
        <div className="p-4 bg-gray-50/50 border-b space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Settings2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Modifier Groups</h3>
                <p className="text-[11px] text-gray-500 font-medium">Link groups or create options</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 text-xs bg-[#1A2F2F] hover:bg-[#E2B13C] hover:text-[#1A2F2F] rounded-xl font-bold text-white transition-all shadow-md active:scale-95"
            >
              <Plus size={16} />
              New Group
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0"
        >
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out",
              showCreate ? "max-h-[520px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2",
            ].join(" ")}
          >
            <div className="pt-0">
              <form
                onSubmit={form.handleSubmit(handleCreateGroup)}
                className="rounded-3xl border-2 border-indigo-100 bg-indigo-50/30 p-5 space-y-4 animate-in fade-in zoom-in duration-200"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 ml-1">Group Name</label>
                    <input
                      {...form.register("name", { required: true })}
                      placeholder="e.g. Choose your Protein"
                      className="w-full rounded-2xl border-none bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 ml-1">Selection Type</label>
                    <div className="flex p-1 bg-white rounded-2xl shadow-sm">
                      {["single", "multiple"].map((type) => (
                        <label key={type} className="flex-1">
                          <input type="radio" value={type} {...form.register("selectionType")} className="sr-only peer" />
                          <span className="flex items-center justify-center py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all peer-checked:bg-indigo-600 peer-checked:text-white text-gray-400">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isRequired ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Is Required?</p>
                      <p className="text-[10px] text-gray-500 font-medium">Customer must pick an option</p>
                    </div>
                  </div>
                  <Controller control={form.control} name="isRequired" render={({ field }) => <Toggle value={!!field.value} onChange={field.onChange} />} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
                  <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-200">Create Group</button>
                </div>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mb-2" />
              <p className="text-sm font-medium">Syncing modifiers...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0)).map((g) => {
                const isAttached = attachedSet.has(g._id);
                const opts = optionsMap[g._id] ?? [];

                return (
                  <div key={g._id} className={`group rounded-3xl border transition-all duration-200 ${isAttached ? 'border-indigo-200 bg-white shadow-md' : 'border-gray-100 bg-gray-50/30'}`}>
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{g.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                            {g.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {g.selectionType.toUpperCase()} • {g.isRequired ? 'REQUIRED' : 'OPTIONAL'} • MIN: {g.minSelections}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleAttach(g._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isAttached 
                            ? 'bg-indigo-600 text-white shadow-indigo-100' 
                            : 'bg-white border text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {savingAttach === g._id ? <Loader2 size={14} className="animate-spin" /> : isAttached ? <Unlink size={14} /> : <Link size={14} /> }
                          {isAttached ? 'Detach' : 'Attach'}
                        </button>
                        
                        <button onClick={() => openAddOption(g._id)} className="p-2 rounded-xl bg-white border text-gray-400 hover:text-[#E2B13C] hover:border-[#E2B13C] transition-all">
                          <Plus size={18} />
                        </button>
                        
                        <button onClick={() => removeGroup(g._id)} className="p-2 rounded-xl bg-white border text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden">
                        <div className="grid grid-cols-[1fr_80px_100px_40px] gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>Option Name</span>
                          <span>Price</span>
                          <span>Status</span>
                          <span />
                        </div>

                        <div className="divide-y divide-gray-100 bg-white">
                          {addingFor === g._id && (
                            <div className="grid grid-cols-[1fr_80px_100px_40px] gap-2 p-2 bg-indigo-50/50 animate-in slide-in-from-left-2">
                              <input autoFocus value={newOptName} onChange={e => setNewOptName(e.target.value)} className="bg-white border-none rounded-lg text-xs font-bold px-2 py-1.5 focus:ring-2 focus:ring-indigo-500" placeholder="Name..." />
                              <input type="number" value={newOptPrice} onChange={e => setNewOptPrice(Number(e.target.value))} className="bg-white border-none rounded-lg text-xs font-bold px-2 py-1.5" />
                              <div className="flex gap-1">
                                <button onClick={() => submitAddOption(g._id)} className="flex-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Add</button>
                                <button onClick={() => setAddingFor(null)} className="flex-1 bg-white border rounded-lg text-[10px] font-bold">X</button>
                              </div>
                            </div>
                          )}

                          {opts.length === 0 && !addingFor ? (
                            <p className="p-4 text-center text-xs text-gray-400 italic">No options defined yet</p>
                          ) : (
                            opts.map((o) => (
                              <div key={o._id} className="grid grid-cols-[1fr_80px_100px_40px] gap-2 px-3 py-2 items-center hover:bg-gray-50 transition-colors">
                                <input 
                                  defaultValue={o.name} 
                                  className="text-xs font-bold border-none bg-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 rounded-md py-1"
                                  onBlur={(e) => e.target.value.trim() !== o.name && patchOption(g._id, o._id, { name: e.target.value })}
                                />
                                <div className="flex items-center text-xs font-bold text-gray-500">
                                  <span className="mr-0.5">$</span>
                                  <input 
                                    type="number" 
                                    defaultValue={o.priceAdjustment} 
                                    className="w-full border-none bg-transparent focus:bg-white p-0"
                                    onBlur={(e) => patchOption(g._id, o._id, { priceAdjustment: Number(e.target.value) })}
                                  />
                                </div>
                                <select 
                                  defaultValue={o.status}
                                  className="text-[10px] font-bold border-none bg-gray-100 rounded-lg py-1 px-2"
                                  onChange={(e) => patchOption(g._id, o._id, { status: e.target.value as ModifierStatus })}
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                                <button onClick={() => removeOption(g._id, o._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white rounded-b-3xl">
          <button
            onClick={() => onClose()}
            className="w-full py-3.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            Finished Configuration
          </button>
        </div>
      </div>
      
      <Modal
        open={!!confirmState}
        title={confirmState?.title ?? "Confirm"}
        onClose={() => (!confirming ? setConfirmState(null) : null)}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-3">
            <div className="mt-0.5 text-red-600">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">
                {confirmState?.title}
              </p>
              {confirmState?.desc && (
                <p className="mt-1 text-xs font-medium text-red-600/90">
                  {confirmState.desc}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={confirming}
              onClick={() => setConfirmState(null)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={confirming}
              onClick={handleConfirmDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 disabled:opacity-70"
            >
              {confirming ? <Loader2 size={14} className="animate-spin" /> : null}
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </Modal>
  );
}
