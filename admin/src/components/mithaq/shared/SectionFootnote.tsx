import { ReactNode } from "react";

// Muted hairline-flanked text used at the bottom of sections.
const SectionFootnote = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.16em] font-semibold text-mithaq-soft2">
    <span className="h-px w-10 bg-mithaq-soft2/40" />
    {children}
    <span className="h-px w-10 bg-mithaq-soft2/40" />
  </div>
);

export default SectionFootnote;
