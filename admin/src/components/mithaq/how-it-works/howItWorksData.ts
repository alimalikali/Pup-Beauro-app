import { CrescentIcon, ScalesIcon, ShieldIcon, RingsIcon } from "../icons";

export type HowItWorksItem = {
  Icon: typeof CrescentIcon;
  title: string;
  body: string;
  step: string;
  tag: string;
  badge?: string;
  spin?: boolean;
  accent: string;
};

export const howItWorksItems: HowItWorksItem[] = [
  {
    Icon: CrescentIcon,
    title: "Define Your Purpose",
    body: "Write your life mission. Our AI reads direction, not demographics.",
    step: "01",
    tag: "Intention",
    accent: "from-mithaq-hot to-mithaq-rose",
    spin: true,
  },
  {
    Icon: ScalesIcon,
    title: "Set Your Priorities",
    body: "Rank deen, education, career, family. Your weights shape every match.",
    step: "02",
    tag: "Alignment",
    accent: "from-mithaq-rose to-mithaq-mid",
  },
  {
    Icon: ShieldIcon,
    title: "Verified Only",
    body: "Every profile is CNIC-verified and human-reviewed before going live.",
    step: "03",
    tag: "Trust",
    badge: "256-bit encrypted",
    accent: "from-mithaq-mid to-mithaq-hot",
  },
  {
    Icon: RingsIcon,
    title: "Covenant Chat",
    body: "Chat only opens after mutual interest. Respect is built into the system.",
    step: "04",
    tag: "Connection",
    accent: "from-mithaq-hot to-mithaq-mid",
  },
];
