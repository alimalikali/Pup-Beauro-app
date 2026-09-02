import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  ornament?: ReactNode;
  className?: string;
};

// Thin pink uppercase eyebrow with hairline rules — reused across sections.
const SectionEyebrow = ({ children, ornament, className = "" }: Props) => (
  <div
    className={`inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-mithaq-hot ${className}`}
  >
    <span className="h-px w-8 bg-mithaq-hot/50" />
    {ornament}
    {children}
    {ornament}
    <span className="h-px w-8 bg-mithaq-hot/50" />
  </div>
);

export default SectionEyebrow;
