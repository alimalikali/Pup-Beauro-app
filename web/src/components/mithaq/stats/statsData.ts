import { Users, Heart, Clock, ShieldCheck } from "lucide-react";

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sub: string;
  icon: typeof Users;
  accent: string;
};

export const statsData: Stat[] = [
  {
    value: 2400,
    suffix: "+",
    label: "Muslims on Mithaq",
    sub: "A growing global ummah of intentional seekers.",
    icon: Users,
    accent: "from-mithaq-hot to-mithaq-rose",
  },
  {
    value: 94,
    suffix: "%",
    label: "Match satisfaction",
    sub: "Members who say their match aligns deeply.",
    icon: Heart,
    accent: "from-mithaq-rose to-mithaq-mid",
  },
  {
    value: 48,
    suffix: "hrs",
    label: "To first match",
    sub: "Average time before a meaningful introduction.",
    icon: Clock,
    accent: "from-mithaq-mid to-mithaq-hot",
  },
  {
    value: 100,
    suffix: "%",
    label: "Verified profiles",
    sub: "Every member ID-checked. Zero catfish, zero noise.",
    icon: ShieldCheck,
    accent: "from-mithaq-hot to-mithaq-mid",
  },
];
