import { useMemo, useState } from "react";
import { Download, ArrowUpDown, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLeads, STAGES, SELLERS, PRIORITIES } from "@/store/leadsStore";
import { exportToFile } from "@/lib/sheet";
import { cn } from "@/lib/utils";
import type { Lead, LeadPriority, LeadStage } from "@/types/lead";
import { toast } from "@/hooks/use-toast";

const stageStyles: Record<LeadStage, string> = {
  Novo: "bg-navy-soft text-primary",
  Qualificado: "bg-gold-soft text-navy-deep",
  Negociação: "bg-accent/20 text-navy-deep",
  Fechado: "bg-success/10 text-success",
};
const priorityStyles: Record<LeadPriority, string> = {
  Alta: "bg-destructive/10 text-destructive",
  Média: "bg-gold-soft text-navy-deep",
  Baixa: "bg-muted text-muted-foreground",
};
const priorityRank: Record<LeadPriority, number> = { Alta: 0, Média: 1, Baixa: 2 };

type SortKey = "name" | "createdAt" | "priority" | "value" | "seller";

export const LeadsDataTable = () => {
  const { leads, updateLead, deleteLead } = useLeads();
  const [search, setSearch] = useState("");
  const [seller, setSeller] = useState<string>("all");
  const [stage, setStage] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "createdAt", dir: "desc" });
  const [editing, setEditing] = useState<{ id: string; field: keyof Lead } | null>(null);
  const [draft, setDraft] = useState("");

  const filtered = useMemo(() => {
    let arr = leads.filter((l) => {
      if (search && !`${l.name} ${l.phone} ${l.product}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (seller !== "all" && l.seller !== seller) return false;
      if (stage !== "all" && l.status !== stage) return false;
      if (from && new Date(l.createdAt) < new Date(from)) return false;
      if (to && new Date(l.createdAt) > new Date(`${to}T23:59:59`)) return false;
      return true;
    });
    arr = [...arr].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "priority") cmp = priorityRank[a.priority] - priorityRank[b.priority];
      else if (sort.key === "value") cmp = a.value - b.value;
      else if (sort.key === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else cmp = String(a[sort.key]).localeCompare(String(b[sort.key]));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [leads, search, seller, stage, from, to, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  const startEdit = (id: string, field: keyof Lead, current: string | number) => {
    setEditing({ id, field }); setDraft(String(current));
  };
  const commitEdit = () => {
    if (!editing) return;
    const value = editing.field === "value" ? Number(draft.replace(/[^\d.-]/g, "")) || 0 : draft;
    updateLead(editing.id, { [editing.field]: value } as Partial<Lead>);
    setEditing(null);
  };

  const handleExport = (format: "csv" | "xlsx", scope: "filtered" | "all") => {
    const data = scope === "filtered" ? filtered : leads;
    exportToFile(data, format, `leads-${scope}-${new Date().toISOString().slice(0, 10)}`);
    toast({ title: "Exportação iniciada", description: `${data.length} leads em ${format.toUpperCase()}` });
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-primary">Tabela Dinâmica</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} de {leads.length} leads · clique em uma célula para editar</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2"><Download className="size-4" /> Exportar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("xlsx", "filtered")}>Filtrados (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "filtered")}>Filtrados (.csv)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx", "all")}>Base completa (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", "all")}>Base completa (.csv)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input placeholder="Buscar nome, telefone, produto…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl bg-background" />
          <Select value={seller} onValueChange={setSeller}>
            <SelectTrigger className="rounded-xl"><Filter className="size-3.5 mr-1 text-muted-foreground" /><SelectValue placeholder="Vendedor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos vendedores</SelectItem>
              {SELLERS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl bg-background" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-xl bg-background" />
        </div>
      </div>

      <div className="overflow-auto max-h-[560px]">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground sticky top-0 z-10">
            <tr>
              <Th onClick={() => toggleSort("name")}>Nome</Th>
              <th className="text-left px-3 py-2.5 font-medium">Telefone</th>
              <th className="text-left px-3 py-2.5 font-medium">Produto</th>
              <th className="text-left px-3 py-2.5 font-medium">Status</th>
              <Th onClick={() => toggleSort("seller")}>Vendedor</Th>
              <Th onClick={() => toggleSort("priority")}>Prioridade</Th>
              <Th onClick={() => toggleSort("value")} className="text-right">Valor</Th>
              <Th onClick={() => toggleSort("createdAt")}>Data</Th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/30 group">
                <EditableCell editing={editing?.id === l.id && editing.field === "name"} value={l.name} draft={draft} setDraft={setDraft}
                  onStart={() => startEdit(l.id, "name", l.name)} onCommit={commitEdit}
                  className="text-primary font-medium" />
                <EditableCell editing={editing?.id === l.id && editing.field === "phone"} value={l.phone} draft={draft} setDraft={setDraft}
                  onStart={() => startEdit(l.id, "phone", l.phone)} onCommit={commitEdit} />
                <EditableCell editing={editing?.id === l.id && editing.field === "product"} value={l.product} draft={draft} setDraft={setDraft}
                  onStart={() => startEdit(l.id, "product", l.product)} onCommit={commitEdit} />
                <td className="px-3 py-2">
                  <Select value={l.status} onValueChange={(v) => updateLead(l.id, { status: v as LeadStage })}>
                    <SelectTrigger className={cn("h-7 rounded-full border-0 px-2.5 text-xs font-medium w-auto gap-1", stageStyles[l.status])}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Select value={l.seller} onValueChange={(v) => updateLead(l.id, { seller: v })}>
                    <SelectTrigger className="h-8 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{SELLERS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Select value={l.priority} onValueChange={(v) => updateLead(l.id, { priority: v as LeadPriority })}>
                    <SelectTrigger className={cn("h-7 rounded-full border-0 px-2.5 text-xs font-medium w-auto gap-1", priorityStyles[l.priority])}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <EditableCell editing={editing?.id === l.id && editing.field === "value"} value={`R$ ${l.value.toLocaleString("pt-BR")}`} draft={draft} setDraft={setDraft}
                  onStart={() => startEdit(l.id, "value", l.value)} onCommit={commitEdit}
                  className="text-right tabular-nums text-primary font-medium" />
                <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                  {new Date(l.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteLead(l.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">Nenhum lead encontrado com os filtros atuais.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Th = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <th className={cn("text-left px-3 py-2.5 font-medium select-none", onClick && "cursor-pointer hover:text-primary", className)} onClick={onClick}>
    <span className="inline-flex items-center gap-1">{children}{onClick && <ArrowUpDown className="size-3 opacity-60" />}</span>
  </th>
);

const EditableCell = ({
  editing, value, draft, setDraft, onStart, onCommit, className,
}: {
  editing: boolean; value: string; draft: string;
  setDraft: (v: string) => void; onStart: () => void; onCommit: () => void; className?: string;
}) => (
  <td className={cn("px-3 py-2", className)} onClick={editing ? undefined : onStart}>
    {editing ? (
      <input
        autoFocus value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => { if (e.key === "Enter") onCommit(); if (e.key === "Escape") onCommit(); }}
        className="w-full bg-background border border-gold rounded-md px-2 py-1 outline-none text-sm"
      />
    ) : (
      <span className="cursor-text block truncate">{value || "—"}</span>
    )}
  </td>
);
