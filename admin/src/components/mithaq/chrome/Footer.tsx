import { CrescentIcon } from "../icons";

const Social = ({ label }: { label: string }) => (
  <a
    href="#"
    aria-label={label}
    className="glass w-9 h-9 rounded-full flex items-center justify-center text-mithaq-hot hover:scale-110 transition-transform"
  >
    <span className="text-[11px] font-bold">{label[0]}</span>
  </a>
);

const Col = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <div className="text-[13px] font-bold uppercase tracking-[0.12em] text-mithaq-hot mb-4">{title}</div>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l}>
          <a href="#" className="text-[14px] text-mithaq-mid2 hover:text-mithaq-hot transition-colors">
            {l}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="relative z-10 mt-12">
      <div className="glass border-t border-white/60">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5">
                <CrescentIcon className="w-7 h-7" />
                <div className="leading-none">
                  <div className="font-display text-[24px] font-medium text-mithaq-ink tracking-[-0.02em]">Mithaq</div>
                  <div className="font-arabic text-[13px] text-mithaq-hot mt-0.5">مِيثَاق</div>
                </div>
              </div>
              <p className="mt-4 text-[14px] text-mithaq-mid2 leading-relaxed max-w-[240px]">
                A covenant, not just a match.
              </p>
              <div className="mt-5 flex gap-2">
                <Social label="Instagram" />
                <Social label="Twitter" />
                <Social label="LinkedIn" />
              </div>
            </div>
            <Col title="Platform" links={["How it Works", "Features", "Pricing", "Sign Up"]} />
            <Col title="Trust" links={["Privacy Policy", "Terms", "Verification Process", "Our Promise"]} />
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[0.12em] text-mithaq-hot mb-4">
                Contact
              </div>
              <p className="text-[14px] text-mithaq-mid2">Questions? We're here.</p>
              <a href="mailto:hello@mithaq.app" className="block mt-2 text-[14px] font-semibold text-mithaq-hot hover:underline">
                hello@mithaq.app
              </a>
              <p className="mt-4 text-[12px] text-mithaq-soft2 italic">Built with Ashes of Revolution</p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-mithaq-blush/60 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-mithaq-soft2">
              © 2025 Mithaq <span className="font-arabic">مِيثَاق</span> · All rights reserved
            </p>
            <p className="text-[12px] text-mithaq-soft2">Made for Bani Adam, by Muslims</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
