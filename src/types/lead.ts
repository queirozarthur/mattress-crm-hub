export type LeadStage = "Novo" | "Qualificado" | "Negociação" | "Fechado";
export type LeadSource = "instagram" | "whatsapp" | "outro";
export type LeadPriority = "Alta" | "Média" | "Baixa";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: LeadStage;
  source: LeadSource;
  seller: string;
  priority: LeadPriority;
  value: number;
  createdAt: string; // ISO
  updatedAt: string;
}

export interface ImportLogEntry {
  id: string;
  user: string;
  date: string; // ISO
  fileName: string;
  added: number;
  updated: number;
  ignored: number;
}
