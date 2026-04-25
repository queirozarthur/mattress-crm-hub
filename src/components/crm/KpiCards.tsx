import { ArrowUpRight, ArrowDownRight, Users, TrendingUp, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
  {
    label: "Leads no Mês",
    value: "284",
    change: "+18.2%",
    trend: "up" as const,
    icon: Users,
    hint: "vs. mês anterior",
  },
  {
    label: "Taxa de Conversão",
    value: "12,4%",
    change: "+2.1%",
    trend: "up" as const,
    icon: TrendingUp,
    hint: "média do trimestre",
  },
  {
    label: "Tempo de Resposta",
    value: "4m 12s",
    change: "-31s",
    trend: "up" as const,
    icon: Clock,
    hint: "meta: < 5min",
  },
  {
    label: "Receita Estimada",
    value: "R$ 86.420",
    change: "-3.4%",
    trend: "down" as const,
    icon: DollarSign,
    hint: "projeção do mês",
  },
];

export const KpiCards = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const Arrow = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={kpi.label}
            className="group bg-card rounded-2xl border border-border p-6 shadow-soft hover:shadow-elegant transition-shadow"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="size-10 rounded-xl bg-navy-soft flex items-center justify-center text-primary">
                <Icon className="size-[18px]" />
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  kpi.trend === "up"
                    ? "bg-gold-soft text-navy-deep"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                <Arrow className="size-3" /> {kpi.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
            <p className="text-3xl font-semibold text-primary tracking-tight">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{kpi.hint}</p>
          </div>
        );
      })}
    </section>
  );
};
