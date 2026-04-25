const stages = [
  { label: "Contato Inicial", count: 284, pct: 100 },
  { label: "Lead Qualificado", count: 162, pct: 57 },
  { label: "Em Negociação", count: 78, pct: 27 },
  { label: "Proposta Enviada", count: 46, pct: 16 },
  { label: "Venda Fechada", count: 35, pct: 12 },
];

export const Funnel = () => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">Funil de Conversão</h2>
        <p className="text-sm text-muted-foreground">Performance dos últimos 30 dias</p>
      </div>

      <div className="space-y-5">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-center gap-2">
                <span className="size-5 rounded-md bg-navy-soft text-primary flex items-center justify-center text-[10px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{s.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-primary tabular-nums">{s.count}</span>
                <span className="text-xs text-muted-foreground ml-2">{s.pct}%</span>
              </div>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={i === stages.length - 1 ? "h-full bg-gradient-gold rounded-full" : "h-full bg-primary rounded-full"}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-navy-soft border border-border/50">
        <p className="text-xs text-muted-foreground mb-1">Receita projetada</p>
        <p className="text-2xl font-semibold text-primary">R$ 142.380</p>
        <p className="text-xs text-success mt-1">↑ 8.2% acima da meta mensal</p>
      </div>
    </div>
  );
};
