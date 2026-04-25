import { History, FileSpreadsheet } from "lucide-react";
import { useLeads } from "@/store/leadsStore";

export const ImportLog = () => {
  const { logs } = useLeads();
  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-9 rounded-xl bg-navy-soft flex items-center justify-center">
          <History className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">Log de Importações</h2>
          <p className="text-sm text-muted-foreground">Histórico das últimas cargas</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          <FileSpreadsheet className="size-8 mx-auto mb-2 opacity-40" />
          Nenhuma importação ainda.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {logs.map((l) => (
            <div key={l.id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{l.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {l.user} · {new Date(l.date).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs shrink-0">
                <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">+{l.added}</span>
                <span className="px-2 py-1 rounded-full bg-gold-soft text-navy-deep font-medium">~{l.updated}</span>
                <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">⊘{l.ignored}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
