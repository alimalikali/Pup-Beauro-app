import sincerityImg from "@/assets/gallery-sincerity.jpg";
import aishaYusufImg from "@/assets/gallery-aisha-yusuf.jpg";
import familyImg from "@/assets/gallery-family.jpg";
import fatimaImranImg from "@/assets/gallery-fatima-imran.jpg";
import covenantImg from "@/assets/gallery-covenant.jpg";

export type StoryTag = "Value" | "Couple" | "Moment";

export type Story = {
  tag: StoryTag;
  eyebrow: string;
  arabic?: string;
  title: string;
  body: string;
  caption?: string;
  image: string;
  alt: string;
};

// Reserve the tail of scroll progress for unpinning, so the final
// card is fully visible while the section is still pinned.
export const STORY_USABLE_PROGRESS = 0.9;

export const storyTagStyles: Record<StoryTag, string> = {
  Value: "bg-mithaq-hot/10 text-mithaq-hot",
  Couple: "bg-mithaq-rose/15 text-mithaq-hot",
  Moment: "bg-mithaq-ink/10 text-mithaq-ink",
};

export const stories: Story[] = [
  {
    tag: "Value",
    eyebrow: "01 — Why we built this",
    arabic: "إخلاص",
    title: "Marriage isn't a swipe. So we stopped designing it like one.",
    body: "Most apps optimize for attention. Mithaq is built around one question — are you both walking in the same direction? Your intention comes before your photo.",
    image: sincerityImg,
    alt: "Soft pink dawn light through Islamic arabesque lattice",
  },
  {
    tag: "Couple",
    eyebrow: "02 — Aisha, 27 & Yusuf, 29",
    title: "\"We talked about parents and finances in the first week. That never happened on other apps.\"",
    body: "Aisha is a paediatric registrar; Yusuf runs a small logistics business. They matched in March, involved both families by April, and signed the nikah nama nine months later in East London.",
    caption: "London, UK · Nikah, Dec 2024",
    image: aishaYusufImg,
    alt: "Muslim couple at golden hour",
  },
  {
    tag: "Value",
    eyebrow: "03 — Family, from day one",
    arabic: "عائلة",
    title: "Your wali isn't a formality at the end. They're invited in at the start.",
    body: "Add a wali to your profile and they can see your matches, sit in on intro calls, and flag concerns early. No more secret chats that fall apart when parents finally find out.",
    image: familyImg,
    alt: "Family hands resting on an open Quran",
  },
  {
    tag: "Couple",
    eyebrow: "04 — Fatima, 31 & Imran, 33",
    title: "\"After three years on other apps, I almost gave up. The first Mithaq match became my husband.\"",
    body: "Both had been married before. Both wanted children, a quiet life, and someone serious about salah. They met for chai with their families in Mississauga — and didn't need a second meeting to know.",
    caption: "Toronto, Canada · Nikah, Aug 2024",
    image: fatimaImranImg,
    alt: "Muslim couple walking through a rose garden at dusk",
  },
  {
    tag: "Moment",
    eyebrow: "05 — The word we're named after",
    arabic: "مِيثَاقًا غَلِيظًا",
    title: "\"And they have taken from you a solemn covenant.\"",
    body: "Mīthāq — a binding promise, not a casual agreement. That's the bar we hold ourselves to: every profile verified, every chat witnessed, every match made for keeps.",
    caption: "Qur'an · An-Nisa 4:21",
    image: covenantImg,
    alt: "Flowing pink silk with gold Arabic calligraphy",
  },
];
