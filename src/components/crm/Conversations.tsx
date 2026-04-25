import { SourceIcon } from "./SourceIcon";
import { cn } from "@/lib/utils";

const messages = [
  {
    name: "Mariana A.",
    initials: "MA",
    text: "Vocês entregam em Campinas no sábado?",
    time: "12 min",
    source: "whatsapp" as const,
    unread: true,
  },
  {
    name: "Rafael T.",
    initials: "RT",
    text: "Tem desconto à vista no Box Casal?",
    time: "38 min",
    source: "instagram" as const,
    unread: true,
  },
  {
    name: "Beatriz C.",
    initials: "BC",
    text: "Pode me mandar fotos do colchão ortopédico?",
    time: "1h",
    source: "whatsapp" as const,
    unread: false,
  },
  {
    name: "Camila D.",
    initials: "CD",
    text: "Obrigada! Vou pensar e retorno amanhã.",
    time: "3h",
    source: "whatsapp" as const,
    unread: false,
  },
];

export const Conversations = () => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-primary">Conversas Recentes</h2>
          <p className="text-sm text-muted-foreground">7 não lidas</p>
        </div>
        <button className="text-xs font-medium text-primary hover:text-gold transition-colors">
          Abrir caixa
        </button>
      </div>

      <div className="space-y-1">
        {messages.map((m) => (
          <div
            key={m.name}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <div className="relative shrink-0">
              <div className="size-10 rounded-full bg-navy-soft text-primary flex items-center justify-center text-sm font-semibold">
                {m.initials}
              </div>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-4 rounded-full flex items-center justify-center border-2 border-card",
                  m.source === "whatsapp" ? "bg-success text-white" : "bg-gold text-navy-deep"
                )}
              >
                <SourceIcon source={m.source} className="size-2.5" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium text-sm text-primary truncate">{m.name}</p>
                <span className="text-[11px] text-muted-foreground shrink-0">{m.time}</span>
              </div>
              <p className={cn("text-xs truncate", m.unread ? "text-foreground font-medium" : "text-muted-foreground")}>
                {m.text}
              </p>
            </div>
            {m.unread && <span className="size-2 rounded-full bg-gold mt-2 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
};
