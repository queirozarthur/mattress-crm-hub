import { SourceIcon } from "./SourceIcon";

export const SourceSplit = () => {
  const insta = 62;
  const whats = 38;
  return (
    <div className="bg-gradient-navy rounded-2xl shadow-elegant p-6 text-primary-foreground">
      <h2 className="text-lg font-semibold mb-1">Origem dos Leads</h2>
      <p className="text-sm text-primary-foreground/60 mb-6">Distribuição por canal este mês</p>

      <div className="flex h-3 rounded-full overflow-hidden mb-5">
        <div className="bg-gold" style={{ width: `${insta}%` }} />
        <div className="bg-success" style={{ width: `${whats}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gold mb-2">
            <SourceIcon source="instagram" className="size-4" />
            <span className="text-xs font-medium">Instagram</span>
          </div>
          <p className="text-2xl font-semibold">{insta}%</p>
          <p className="text-xs text-primary-foreground/60">176 leads</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-success mb-2">
            <SourceIcon source="whatsapp" className="size-4" />
            <span className="text-xs font-medium">WhatsApp</span>
          </div>
          <p className="text-2xl font-semibold">{whats}%</p>
          <p className="text-xs text-primary-foreground/60">108 leads</p>
        </div>
      </div>
    </div>
  );
};
