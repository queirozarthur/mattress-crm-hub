import * as XLSX from "xlsx";
import type { Lead, LeadStage, LeadSource, LeadPriority } from "@/types/lead";

export const CRM_FIELDS = [
  { key: "name", label: "Nome", required: true },
  { key: "phone", label: "Telefone", required: true },
  { key: "product", label: "Produto", required: false },
  { key: "status", label: "Status", required: false },
  { key: "source", label: "Origem", required: false },
  { key: "seller", label: "Vendedor", required: false },
  { key: "priority", label: "Prioridade", required: false },
  { key: "value", label: "Valor", required: false },
] as const;

export type CrmField = typeof CRM_FIELDS[number]["key"];

const aliasMap: Record<CrmField, string[]> = {
  name: ["nome", "name", "cliente", "lead"],
  phone: ["telefone", "phone", "celular", "whatsapp", "contato", "fone"],
  product: ["produto", "product", "interesse", "item"],
  status: ["status", "estagio", "estágio", "etapa", "fase"],
  source: ["origem", "source", "canal", "fonte"],
  seller: ["vendedor", "seller", "responsavel", "responsável", "atendente"],
  priority: ["prioridade", "priority"],
  value: ["valor", "value", "preco", "preço", "ticket"],
};

export const autoMapColumns = (headers: string[]): Record<string, CrmField | ""> => {
  const out: Record<string, CrmField | ""> = {};
  for (const h of headers) {
    const norm = h.toString().trim().toLowerCase();
    let matched: CrmField | "" = "";
    for (const f of CRM_FIELDS) {
      if (aliasMap[f.key].some((a) => norm === a || norm.includes(a))) {
        matched = f.key;
        break;
      }
    }
    out[h] = matched;
  }
  return out;
};

export const parseFile = async (file: File): Promise<{ headers: string[]; rows: Record<string, unknown>[] }> => {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { headers, rows };
};

const normalizeStage = (v: string): LeadStage => {
  const s = v.toLowerCase();
  if (s.includes("qual")) return "Qualificado";
  if (s.includes("neg")) return "Negociação";
  if (s.includes("fech") || s.includes("ganh") || s.includes("conclu")) return "Fechado";
  return "Novo";
};
const normalizeSource = (v: string): LeadSource => {
  const s = v.toLowerCase();
  if (s.includes("insta")) return "instagram";
  if (s.includes("whats") || s.includes("wpp")) return "whatsapp";
  return "outro";
};
const normalizePriority = (v: string): LeadPriority => {
  const s = v.toLowerCase();
  if (s.includes("alt") || s === "1") return "Alta";
  if (s.includes("baix") || s === "3") return "Baixa";
  return "Média";
};
const normalizeValue = (v: unknown): number => {
  if (typeof v === "number") return v;
  const cleaned = String(v ?? "").replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export interface PreparedRow {
  raw: Record<string, unknown>;
  lead: Partial<Lead>;
  errors: string[];
}

export const prepareRows = (
  rows: Record<string, unknown>[],
  mapping: Record<string, CrmField | "">
): PreparedRow[] => {
  return rows.map((raw) => {
    const lead: Partial<Lead> = {};
    for (const [col, field] of Object.entries(mapping)) {
      if (!field) continue;
      const val = raw[col];
      switch (field) {
        case "status": lead.status = normalizeStage(String(val || "")); break;
        case "source": lead.source = normalizeSource(String(val || "")); break;
        case "priority": lead.priority = normalizePriority(String(val || "")); break;
        case "value": lead.value = normalizeValue(val); break;
        default: (lead as Record<string, unknown>)[field] = String(val ?? "").trim();
      }
    }
    const errors: string[] = [];
    if (!lead.name) errors.push("Nome ausente");
    if (!lead.phone || lead.phone.replace(/\D/g, "").length < 8) errors.push("Telefone inválido");
    return { raw, lead, errors };
  });
};

export const exportToFile = (leads: Lead[], format: "csv" | "xlsx", fileName = "leads") => {
  const data = leads.map((l) => ({
    Nome: l.name,
    Telefone: l.phone,
    Produto: l.product,
    Status: l.status,
    Origem: l.source,
    Vendedor: l.seller,
    Prioridade: l.priority,
    Valor: l.value,
    "Criado em": new Date(l.createdAt).toLocaleString("pt-BR"),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  if (format === "csv") XLSX.writeFile(wb, `${fileName}.csv`, { bookType: "csv" });
  else XLSX.writeFile(wb, `${fileName}.xlsx`);
};
