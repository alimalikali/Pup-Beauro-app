import StatsHeading from "../stats/StatsHeading";
import StatCard from "../stats/StatCard";
import { statsData } from "../stats/statsData";
import SectionFootnote from "../shared/SectionFootnote";

const Stats = () => (
  <section className="relative z-10 py-24 md:py-32">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-mithaq-hot/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-mithaq-rose/10 blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-6xl px-6">
      <StatsHeading />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {statsData.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      <div className="mt-10">
        <SectionFootnote>Updated weekly · Verified by Mithaq</SectionFootnote>
      </div>
    </div>
  </section>
);

export default Stats;
