import { MoreHorizontal } from "lucide-react";
import { SourceBadge } from "./SourceIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Stage = "Novo" | "Qualificado" | "Negociação" | "Fechado";

const stageStyles: Record<Stage, string> = {
  Novo: "bg-navy-soft text-primary",
  Qualificado: "bg-gold-soft text-navy-deep",
  Negociação: "bg-amber-100 text-amber-900",
  Fechado: "bg-success/10 text-success",
};

const leads = [
  {
    name: "Mariana Albuquerque",
    initials: "MA",
    contact: "(11) 98421-0090",
    interest: "Colchão King Pillow Top",
    value: "R$ 4.890",
    stage: "Negociação" as Stage,
    source: "whatsapp" as const,
    last: "há 12 min",
  },
  {
    name: "Rafael Tonon",
    initials: "RT",
    contact: "@rafa.tonon",
    interest: "Conjunto Box Casal Premium",
    value: "R$ 2.350",
    stage: "Qualificado" as Stage,
    source: "instagram" as const,
    last: "há 38 min",
  },
  {
    name: "Beatriz Carvalho",
    initials: "BC",
    contact: "(11) 99710-2244",
    interest: "Colchão Solteiro Ortopédico",
    value: "R$ 1.290",
    stage: "Novo" as Stage,
    source: "whatsapp" as const,
    last: "há 1h",
  },
  {
    name: "Henrique Lopes",
    initials: "HL",
    contact: "@henriquelps",
    interest: "Travesseiros Viscoelásticos",
    value: "R$ 480",
    stage: "Fechado" as Stage,
    source: "instagram" as const,
    last: "há 2h",
  },
  {
    name: "Camila Duarte",
    initials: "CD",
    contact: "(11) 98765-1100",
    interest: "Colchão Queen Molas Ensacadas",
    value: "R$ 5.620",
    stage: "Qualificado" as Stage,
    source: "whatsapp" as const,
    last: "há 3h",
  },
  {
    name: "Luiz Felipe Souza",
    initials: "LS",
    contact: "@lfsouza",
    interest: "Cabeceira Estofada",
    value: "R$ 980",
    stage: "Novo" as Stage,
    source: "instagram" as const,
    last: "há 4h",
  },
];

export const LeadsTable = () => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-primary">Leads Recentes</h2>
          <p className="text-sm text-muted-foreground">Atualizado em tempo real</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-medium">Todos</button>
          <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted">Instagram</button>
          <button className="px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted">WhatsApp</button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {leads.map((lead) => (
          <div
            key={lead.name}
            className="grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
          >
            <div className="col-span-12 md:col-span-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-navy text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                {lead.initials}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-primary truncate">{lead.name}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.contact}</p>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3">
              <p className="text-sm text-foreground truncate">{lead.interest}</p>
              <p className="text-xs text-muted-foreground">{lead.last}</p>
            </div>

            <div className="col-span-3 md:col-span-2">
              <SourceBadge source={lead.source} />
            </div>

            <div className="col-span-3 md:col-span-2">
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", stageStyles[lead.stage])}>
                {lead.stage}
              </span>
            </div>

            <div className="hidden md:flex col-span-1 items-center justify-end gap-2">
              <span className="text-sm font-semibold text-primary tabular-nums">{lead.value}</span>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Mostrando 6 de 284 leads</p>
        <Button variant="outline" size="sm" className="rounded-xl">Ver todos</Button>
      </div>
    </div>
  );
};
