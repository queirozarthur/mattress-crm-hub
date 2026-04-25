import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { Lead, ImportLogEntry, LeadStage, LeadSource, LeadPriority } from "@/types/lead";

const seed: Lead[] = [
  { id: "1", name: "Mariana Albuquerque", phone: "(11) 98421-0090", product: "Colchão King Pillow Top", status: "Negociação", source: "whatsapp", seller: "Eduarda Mendes", priority: "Alta", value: 4890, createdAt: "2026-04-22T10:00:00Z", updatedAt: "2026-04-25T08:00:00Z" },
  { id: "2", name: "Rafael Tonon", phone: "(11) 98700-1122", product: "Conjunto Box Casal Premium", status: "Qualificado", source: "instagram", seller: "Carlos Lima", priority: "Média", value: 2350, createdAt: "2026-04-23T14:00:00Z", updatedAt: "2026-04-25T07:30:00Z" },
  { id: "3", name: "Beatriz Carvalho", phone: "(11) 99710-2244", product: "Colchão Solteiro Ortopédico", status: "Novo", source: "whatsapp", seller: "Eduarda Mendes", priority: "Baixa", value: 1290, createdAt: "2026-04-24T09:00:00Z", updatedAt: "2026-04-25T09:00:00Z" },
  { id: "4", name: "Henrique Lopes", phone: "(11) 98800-3344", product: "Travesseiros Viscoelásticos", status: "Fechado", source: "instagram", seller: "Carlos Lima", priority: "Baixa", value: 480, createdAt: "2026-04-20T11:00:00Z", updatedAt: "2026-04-24T17:00:00Z" },
  { id: "5", name: "Camila Duarte", phone: "(11) 98765-1100", product: "Colchão Queen Molas Ensacadas", status: "Qualificado", source: "whatsapp", seller: "Eduarda Mendes", priority: "Alta", value: 5620, createdAt: "2026-04-21T15:00:00Z", updatedAt: "2026-04-25T06:00:00Z" },
  { id: "6", name: "Luiz Felipe Souza", phone: "(11) 98655-7788", product: "Cabeceira Estofada", status: "Novo", source: "instagram", seller: "Carlos Lima", priority: "Média", value: 980, createdAt: "2026-04-25T07:00:00Z", updatedAt: "2026-04-25T07:00:00Z" },
];

interface LeadsCtx {
  leads: Lead[];
  logs: ImportLogEntry[];
  addLead: (l: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  bulkUpsert: (incoming: Lead[], strategy: "update" | "ignore") => { added: number; updated: number; ignored: number };
  addLog: (entry: ImportLogEntry) => void;
  findByPhone: (phone: string) => Lead | undefined;
}

const Ctx = createContext<LeadsCtx | null>(null);

export const normalizePhone = (p: string) => (p || "").replace(/\D/g, "");

export const LeadsProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>(seed);
  const [logs, setLogs] = useState<ImportLogEntry[]>([]);

  const addLead = useCallback((l: Lead) => setLeads((s) => [l, ...s]), []);
  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) =>
      setLeads((s) => s.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l))),
    []
  );
  const deleteLead = useCallback((id: string) => setLeads((s) => s.filter((l) => l.id !== id)), []);

  const findByPhone = useCallback(
    (phone: string) => leads.find((l) => normalizePhone(l.phone) === normalizePhone(phone)),
    [leads]
  );

  const bulkUpsert = useCallback(
    (incoming: Lead[], strategy: "update" | "ignore") => {
      let added = 0, updated = 0, ignored = 0;
      setLeads((current) => {
        const next = [...current];
        const indexByPhone = new Map(next.map((l, i) => [normalizePhone(l.phone), i]));
        for (const inc of incoming) {
          const key = normalizePhone(inc.phone);
          if (key && indexByPhone.has(key)) {
            if (strategy === "update") {
              const idx = indexByPhone.get(key)!;
              next[idx] = { ...next[idx], ...inc, id: next[idx].id, updatedAt: new Date().toISOString() };
              updated++;
            } else {
              ignored++;
            }
          } else {
            next.unshift(inc);
            if (key) indexByPhone.set(key, 0);
            added++;
          }
        }
        return next;
      });
      return { added, updated, ignored };
    },
    []
  );

  const addLog = useCallback((entry: ImportLogEntry) => setLogs((s) => [entry, ...s]), []);

  return (
    <Ctx.Provider value={{ leads, logs, addLead, updateLead, deleteLead, bulkUpsert, addLog, findByPhone }}>
      {children}
    </Ctx.Provider>
  );
};

export const useLeads = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLeads must be used within LeadsProvider");
  return v;
};

export const STAGES: LeadStage[] = ["Novo", "Qualificado", "Negociação", "Fechado"];
export const SOURCES: LeadSource[] = ["instagram", "whatsapp", "outro"];
export const PRIORITIES: LeadPriority[] = ["Alta", "Média", "Baixa"];
export const SELLERS = ["Eduarda Mendes", "Carlos Lima", "Patrícia Rocha"];
