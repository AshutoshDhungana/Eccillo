import { useNavigate } from "react-router";
import {
  ArrowRight,
  ArrowUp,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { TypingCycle } from "../components/TypingCycle";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import heroImage from "../../imports/LandingPage/69ae82ef8326e6b21df4d71032b51e9939041794.png";

const PROMPTS = [
  "Send an RFP to the top five AV companies.",
  "Invite all of my close family members for the baby shower.",
  "Make arrangements for the venue for my wedding in January.",
  "Book me two photographers for the conference in Los Angeles.",
];

const NAV_LINKS = ["Pricing", "Services", "Vendors", "Events"];

const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
  { title: "Marketplace", links: ["Vendors", "Sponsors", "Talents", "Venues"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { title: "Support", links: ["Help Center", "Contact", "Status", "Terms"] },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-4 backdrop-blur-md sm:px-8">
        <Logo textClassName="text-white" markSize={26} className="text-white" />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="font-['Helvetica_Now_Display:Regular',sans-serif] text-[15px] text-white/70 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full px-5 py-2 font-['Helvetica_Now_Display:Medium',sans-serif] text-[14px] text-white/80 transition-colors hover:text-white"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="rounded-full bg-white px-5 py-2 font-['Helvetica_Now_Display:Medium',sans-serif] text-[14px] text-black transition-transform hover:scale-[1.03]"
          >
            Signup
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <ImageWithFallback
          src={heroImage}
          alt="Event atmosphere"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        <div className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-8 px-4 py-24 text-center sm:py-32">
          <h1 className="font-['Georgia_Pro:Light',serif] text-[clamp(36px,6vw,72px)] leading-[1.15]">
            Everything an event needs.
            <br />
            <span className="font-['Georgia_Pro:Light_Italic',serif] italic">
              Nothing it doesn't.
            </span>
          </h1>
          <p className="max-w-[560px] font-['Helvetica_Now_Display:Light',sans-serif] text-[clamp(15px,2vw,18px)] text-white/70">
            From the first spark to the final encore, Eccillo unites every part
            of event operations into one intelligent platform.
          </p>

          {/* AI prompt bar with typing animation */}
          <div className="flex w-full max-w-[620px] items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur">
            <Sparkles className="size-5 shrink-0 text-white/60" />
            <TypingCycle
              prompts={PROMPTS}
              className="flex-1 truncate text-left font-['Helvetica_Now_Display:Light',sans-serif] text-[15px] text-white/80"
            />
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black"
              aria-label="Send prompt"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full bg-white px-7 py-3 font-['Helvetica_Now_Display:Medium',sans-serif] text-[15px] text-black transition-transform hover:scale-[1.03]"
          >
            Get Started <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* One Platform section */}
      <section className="mx-auto max-w-[900px] px-4 py-24 text-center sm:py-32">
        <h2 className="font-['Georgia_Pro:Light',serif] text-[clamp(32px,5vw,56px)] leading-[1.2]">
          The <span className="font-['Georgia_Pro:Light_Italic',serif] italic">One Platform</span> You
          Need to Bring Any Event to{" "}
          <span className="font-['Georgia_Pro:Light_Italic',serif] italic">Life.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] font-['Helvetica_Now_Display:Light',sans-serif] text-[clamp(15px,2vw,18px)] text-white/60">
          Eccillo unifies planning, vendor discovery, sponsor matching, and
          execution into one intelligent platform - so every event starts with
          progress, not an empty page.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full bg-white px-7 py-3 font-['Helvetica_Now_Display:Medium',sans-serif] text-[15px] text-black transition-transform hover:scale-[1.03]"
          >
            Start Planning
          </button>
          <button
            type="button"
            className="rounded-full border border-white/25 px-7 py-3 font-['Helvetica_Now_Display:Medium',sans-serif] text-[15px] text-white transition-colors hover:bg-white/10"
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* Ask Your Event Copilot */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(99,102,241,0.35) 0%, rgba(236,72,153,0.25) 45%, rgba(0,0,0,0) 80%)",
          }}
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-8 text-center">
          <Sparkles className="size-8 text-white" />
          <h2 className="font-['Georgia_Pro:Light',serif] text-[clamp(30px,5vw,52px)]">
            Ask Your Event Copilot
          </h2>
          <p className="max-w-[520px] font-['Helvetica_Now_Display:Light',sans-serif] text-[15px] text-white/70">
            Describe what you need in plain words and let Eccillo's AI copilot
            draft the plan, budget, and vendor shortlist in seconds.
          </p>

          <div className="flex w-full items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
            <TypingCycle
              prompts={PROMPTS}
              className="flex-1 truncate text-left font-['Helvetica_Now_Display:Light',sans-serif] text-[15px] text-white/80"
            />
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black"
              aria-label="Send prompt"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>

          {/* Response summary card */}
          <div className="w-full rounded-[20px] border border-white/10 bg-[#141414] p-6 text-left">
            <p className="mb-4 font-['Helvetica_Now_Display:Regular',sans-serif] text-[14px] text-white/60">
              Here's a starting plan for your event:
            </p>
            <div className="flex flex-col divide-y divide-white/10">
              {[
                ["Budget", "$24,500 estimated"],
                ["Venues", "5 matched nearby"],
                ["Timeline", "8 weeks to event day"],
                ["Vendors", "12 recommended"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 font-['Inter:Regular',sans-serif] text-[15px]"
                >
                  <span className="text-white/60">{label}</span>
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-4 py-16 sm:px-8">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo textClassName="text-white" markSize={24} className="text-white" />
            <p className="mt-4 max-w-[240px] font-['Helvetica_Now_Display:Light',sans-serif] text-[14px] text-white/50">
              Every event. Every connection. All in one place.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-['Helvetica_Now_Display:Medium',sans-serif] text-[14px] text-white">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-['Helvetica_Now_Display:Light',sans-serif] text-[14px] text-white/50 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-[1200px] flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-['Helvetica_Now_Display:Light',sans-serif] text-[13px] text-white/40">
            © 2026 Eccillo. All rights reserved.
          </p>
          <div className="flex w-full max-w-[360px] items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-full border border-white/15 bg-white/5 px-4 font-['Helvetica_Now_Display:Light',sans-serif] text-[14px] text-white outline-none placeholder:text-white/40"
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-full bg-white px-5 font-['Helvetica_Now_Display:Medium',sans-serif] text-[14px] text-black"
            >
              Subscribe
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
