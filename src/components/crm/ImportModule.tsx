import { useCallback, useMemo, useState } from "react";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLeads, normalizePhone } from "@/store/leadsStore";
import { CRM_FIELDS, autoMapColumns, parseFile, prepareRows, type CrmField } from "@/lib/sheet";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Lead } from "@/types/lead";

type Step = "drop" | "map" | "preview";

export const ImportModule = () => {
  const { findByPhone, bulkUpsert, addLog } = useLeads();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("drop");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [mapping, setMapping] = useState<Record<string, CrmField | "">>({});
  const [strategy, setStrategy] = useState<"update" | "ignore">("update");
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setStep("drop"); setFile(null); setHeaders([]); setRows([]); setMapping({});
  };

  const handleFile = useCallback(async (f: File) => {
    try {
      const { headers, rows } = await parseFile(f);
      if (rows.length === 0) {
        toast({ title: "Planilha vazia", description: "Nenhum dado encontrado.", variant: "destructive" });
        return;
      }
      setFile(f); setHeaders(headers); setRows(rows);
      setMapping(autoMapColumns(headers));
      setStep("map");
    } catch {
      toast({ title: "Erro ao ler arquivo", description: "Verifique se é .csv ou .xlsx válido.", variant: "destructive" });
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const prepared = useMemo(() => prepareRows(rows, mapping), [rows, mapping]);

  const stats = useMemo(() => {
    let dup = 0, invalid = 0;
    for (const p of prepared) {
      if (p.errors.length) invalid++;
      else if (p.lead.phone && findByPhone(p.lead.phone)) dup++;
    }
    return { total: prepared.length, dup, invalid, valid: prepared.length - invalid };
  }, [prepared, findByPhone]);

  const requiredMapped = CRM_FIELDS.filter((f) => f.required).every((f) =>
    Object.values(mapping).includes(f.key)
  );

  const confirmImport = () => {
    const valid = prepared.filter((p) => p.errors.length === 0);
    const leadsToImport: Lead[] = valid.map((p, i) => ({
      id: `imp-${Date.now()}-${i}`,
      name: p.lead.name || "",
      phone: p.lead.phone || "",
      product: p.lead.product || "",
      status: p.lead.status || "Novo",
      source: p.lead.source || "outro",
      seller: p.lead.seller || "—",
      priority: p.lead.priority || "Média",
      value: p.lead.value || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const res = bulkUpsert(leadsToImport, strategy);
    addLog({
      id: `log-${Date.now()}`,
      user: "Eduarda Mendes",
      date: new Date().toISOString(),
      fileName: file?.name || "planilha",
      added: res.added, updated: res.updated, ignored: res.ignored,
    });
    toast({
      title: "Importação concluída",
      description: `${res.added} novos · ${res.updated} atualizados · ${res.ignored} ignorados`,
    });
    setOpen(false); reset();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-xl bg-primary hover:bg-navy-deep text-primary-foreground gap-2 shadow-elegant">
        <Upload className="size-4" /> Importar Planilha
      </Button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {step === "drop" && "Importar leads via planilha"}
              {step === "map" && "Mapear colunas"}
              {step === "preview" && "Pré-visualização e validação"}
            </DialogTitle>
          </DialogHeader>

          {step === "drop" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-colors",
                dragOver ? "border-gold bg-gold-soft/40" : "border-border bg-muted/30"
              )}
            >
              <div className="size-14 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center mb-4 shadow-elegant">
                <FileSpreadsheet className="size-6 text-navy-deep" />
              </div>
              <p className="text-primary font-medium mb-1">Arraste seu arquivo aqui</p>
              <p className="text-sm text-muted-foreground mb-4">Aceita .csv e .xlsx · até 10.000 linhas</p>
              <label>
                <input type="file" accept=".csv,.xlsx,.xls" hidden
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                <span className="inline-flex h-10 items-center px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-navy-deep">
                  Selecionar arquivo
                </span>
              </label>
            </div>
          )}

          {step === "map" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Detectamos {headers.length} colunas em <span className="text-primary font-medium">{file?.name}</span>. Confira o mapeamento:
              </p>
              <div className="max-h-[360px] overflow-auto rounded-xl border border-border divide-y divide-border">
                {headers.map((h) => (
                  <div key={h} className="grid grid-cols-2 items-center gap-3 p-3 hover:bg-muted/40">
                    <div>
                      <p className="text-sm font-medium text-primary">{h}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ex: {String(rows[0]?.[h] ?? "—")}
                      </p>
                    </div>
                    <Select
                      value={mapping[h] || "_skip"}
                      onValueChange={(v) => setMapping({ ...mapping, [h]: v === "_skip" ? "" : (v as CrmField) })}
                    >
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_skip">Ignorar coluna</SelectItem>
                        {CRM_FIELDS.map((f) => (
                          <SelectItem key={f.key} value={f.key}>
                            {f.label}{f.required && " *"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              {!requiredMapped && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="size-4" /> Mapeie os campos obrigatórios (Nome, Telefone) para continuar.
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={reset}>Cancelar</Button>
                <Button disabled={!requiredMapped} onClick={() => setStep("preview")}>Continuar</Button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <Stat label="Total" value={stats.total} tone="neutral" />
                <Stat label="Válidas" value={stats.valid} tone="success" />
                <Stat label="Duplicadas" value={stats.dup} tone="gold" />
                <Stat label="Com erro" value={stats.invalid} tone="error" />
              </div>

              <div className="max-h-[280px] overflow-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">#</th>
                      <th className="text-left px-3 py-2 font-medium">Nome</th>
                      <th className="text-left px-3 py-2 font-medium">Telefone</th>
                      <th className="text-left px-3 py-2 font-medium">Produto</th>
                      <th className="text-left px-3 py-2 font-medium">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prepared.slice(0, 50).map((p, i) => {
                      const isDup = p.errors.length === 0 && p.lead.phone && findByPhone(p.lead.phone);
                      const hasErr = p.errors.length > 0;
                      return (
                        <tr key={i} className={cn(
                          "border-t border-border",
                          hasErr && "bg-destructive/5",
                          isDup && "bg-gold-soft/40"
                        )}>
                          <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                          <td className="px-3 py-2 text-primary">{p.lead.name || "—"}</td>
                          <td className="px-3 py-2 text-foreground">{p.lead.phone || "—"}</td>
                          <td className="px-3 py-2 text-foreground truncate max-w-[180px]">{p.lead.product || "—"}</td>
                          <td className="px-3 py-2">
                            {hasErr ? (
                              <span className="inline-flex items-center gap-1 text-xs text-destructive font-medium">
                                <AlertTriangle className="size-3" /> {p.errors.join(", ")}
                              </span>
                            ) : isDup ? (
                              <span className="text-xs text-navy-deep font-medium">Duplicado (telefone existe)</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                                <CheckCircle2 className="size-3" /> Pronto
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {stats.dup > 0 && (
                <div className="rounded-xl border border-border p-4 bg-muted/30">
                  <p className="text-sm font-medium text-primary mb-2">Como tratar duplicados?</p>
                  <RadioGroup value={strategy} onValueChange={(v) => setStrategy(v as "update" | "ignore")} className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="update" id="upd" /><Label htmlFor="upd" className="text-sm">Atualizar dados existentes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="ignore" id="ign" /><Label htmlFor="ign" className="text-sm">Ignorar duplicados</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("map")}>Voltar</Button>
                <Button onClick={confirmImport} disabled={stats.valid === 0} className="gap-2">
                  <CheckCircle2 className="size-4" /> Confirmar importação
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: number; tone: "neutral" | "success" | "gold" | "error" }) => {
  const styles = {
    neutral: "bg-muted text-primary",
    success: "bg-success/10 text-success",
    gold: "bg-gold-soft text-navy-deep",
    error: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className={cn("rounded-xl p-3", styles)}>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
};
