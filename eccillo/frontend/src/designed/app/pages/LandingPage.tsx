import { ArrowRight, ArrowUp, Sparkle } from "lucide-react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import heroImage from "../../imports/LandingPage/69ae82ef8326e6b21df4d71032b51e9939041794.png";
import gradientBackdrop from "../../imports/LandingPage/f4f0f51725fba6b1cb230c8a9dbb71ed9c4fcec7.png";
import twitterIcon from "../../imports/LandingPage/social-twitter.svg";
import linkedinIcon from "../../imports/LandingPage/social-linkedin.svg";
import instagramIcon from "../../imports/LandingPage/social-instagram.svg";
import youtubeIcon from "../../imports/LandingPage/social-youtube.svg";

const navLinks = ["Pricing", "Services", "Vendors", "Events"];

const planSummary = [
  { label: "Budget", pill: "Estimated", value: "$85,000" },
  { label: "Venues Found", pill: "Top Match", value: "The Domain Austin" },
  { label: "Timeline", pill: "Generated", value: "12-week plan" },
  { label: "Vendors", pill: "Shortlisted", value: "8 recommended" },
];

const footerColumns = [
  { title: "Product", links: ["Plan", "Find", "Execute", "Insights", "AI Copilot"] },
  { title: "Marketplace", links: ["Vendors", "Sponsors", "Talent", "Procurement"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { title: "Support", links: ["Help Center", "Contact", "API Docs", "Status"] },
];

const socials = [
  { name: "X", icon: twitterIcon },
  { name: "LinkedIn", icon: linkedinIcon },
  { name: "Instagram", icon: instagramIcon },
  { name: "YouTube", icon: youtubeIcon },
];

export default function LandingPage() {
  const navigate = useNavigate();
  // Both prompt bars are top-of-funnel: capture the intent, hand it to signup.
  const askCopilot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = new FormData(event.currentTarget).get("prompt");
    navigate("/signup", { state: { prompt } });
  };

  return (
    <div className="designed-public-screen min-h-screen bg-black font-['Inter',sans-serif] text-white">
      <header className="absolute inset-x-0 top-0 z-20 flex h-[112px] items-center gap-6 px-6 lg:px-[52px]">
        <Logo textClassName="font-['Lora',serif] text-white" markSize={24} className="shrink-0 text-white" />
        <nav className="hidden flex-1 justify-center gap-12 font-['Helvetica_Now_Display',sans-serif] text-xl text-white lg:flex">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="focus-ring">
              {link}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center rounded-full bg-[#d9d9d9]/50 p-0 font-['Helvetica_Now_Display',sans-serif] text-lg shadow-[0_0_20px_rgba(0,0,0,.47)] lg:ml-0">
          <button type="button" onClick={() => navigate("/signup")} className="focus-ring h-[55px] rounded-full px-6 text-black">
            Signup
          </button>
          <button type="button" onClick={() => navigate("/login")} className="focus-ring h-[55px] rounded-full bg-black/85 px-8 text-white">
            Log in
          </button>
        </div>
      </header>

      <main>
        {/* Hero: bright sky artwork, so the type here is intentionally black. */}
        <section className="relative flex min-h-[760px] flex-col overflow-hidden bg-black lg:h-[1000px]">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-x-0 top-[-150px] h-[1200px] w-full max-w-none object-cover"
          />
          {/* The Figma inset shadow: a bottom fade that hands off to the next section. */}
          <div className="absolute inset-0 shadow-[inset_0_-250px_150px_rgba(0,0,0,.86)]" />

          <div className="relative flex flex-col items-center gap-6 px-6 pt-[190px] text-center text-black lg:px-[120px] lg:pt-[262px]">
            {/* Georgia Pro / Helvetica Now Display are aliased to system faces with no
                italic cut, and the app disables font-synthesis globally — re-enable it
                here so the design's italic accents actually slant. */}
            <h1 className="font-['Georgia_Pro',serif] text-[clamp(38px,5.6vw,72px)] font-light leading-tight tracking-[-.03em] [&_em]:[font-synthesis:style]">
              <em>Everything</em> an event needs.
              <br />
              <em>Nothing</em> it doesn&apos;t.
            </h1>
            <p className="max-w-[862px] font-['Helvetica_Now_Display',sans-serif] text-[clamp(18px,2.4vw,32px)] font-light leading-[1.3] [&_em]:[font-synthesis:style]">
              From the first <em>idea</em> to the final <em>applause</em>,
              <br />
              plan, source, and manage <em>everything</em> in <em>one place</em>.
            </p>
          </div>

          <div className="relative mt-auto flex flex-col items-center gap-8 px-6 pb-[130px] pt-16 lg:pb-[192px]">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="focus-ring flex w-[240px] items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-lg font-medium text-white"
            >
              Get Started <ArrowRight size={24} />
            </button>

            <form
              onSubmit={askCopilot}
              className="flex h-[80px] w-full max-w-[860px] items-center rounded-full border border-white/20 bg-white/45 pl-9 pr-[17px] shadow-[0_4px_50px_rgba(0,0,0,.4)] backdrop-blur-sm"
            >
              <input
                name="prompt"
                aria-label="Ask the Eccillo copilot"
                placeholder="Send an RFP to the top five AV companies."
                className="min-w-0 flex-1 bg-transparent text-xl text-[#353434] outline-none placeholder:text-[#353434]/65"
              />
              <button
                type="submit"
                aria-label="Send"
                className="focus-ring flex size-12 shrink-0 items-center justify-center rounded-[24px] bg-[#f5f5f5] text-black drop-shadow-[2px_2px_5px_rgba(0,0,0,.25)]"
              >
                <ArrowUp size={24} />
              </button>
            </form>
          </div>
        </section>

        {/* One artwork backs both of the next two sections, exactly as in Figma. */}
        <div className="relative isolate overflow-hidden">
          <img src={gradientBackdrop} alt="" className="absolute inset-0 -z-10 size-full object-cover" />

          <section className="flex items-center px-6 py-[120px] lg:h-[720px] lg:items-start lg:px-[80px] lg:py-0 lg:pt-[140px]">
            <div className="flex w-full max-w-[760px] flex-col gap-6">
              <h2 className="font-['Lora',serif] text-[clamp(34px,4.4vw,56px)] leading-[1.15] tracking-[-.02em] text-white">
                The One Platform You Need to Bring Any Event to Life.
              </h2>
              <p className="text-[clamp(17px,1.8vw,22px)] font-light leading-[1.4] text-white/70">
                Eccillo unifies planning, vendor discovery, sponsor matching, and execution into one
                intelligent platform - so every event starts with progress, not an empty form.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="focus-ring rounded-full bg-white px-8 py-4 text-lg font-medium text-black"
                >
                  Start Planning
                </button>
                <a
                  href="#how-it-works"
                  className="focus-ring rounded-full border border-[#d9d9d9] px-8 py-4 text-lg text-white"
                >
                  See How It Works
                </a>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="flex flex-col items-center gap-12 px-6 py-[120px] lg:p-[120px]">
            <Sparkle size={48} className="text-black" fill="currentColor" />

            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="font-['Lora',serif] text-[clamp(34px,4.4vw,56px)] tracking-[-.02em] text-black">
                Ask Your Event Copilot
              </h2>
              <p className="max-w-[680px] text-lg leading-[1.5] text-black/70">
                From building your event plan to sourcing vendors and sponsors — your AI copilot
                handles the work, you make the decisions.
              </p>
            </div>

            <form
              onSubmit={askCopilot}
              className="flex h-[80px] w-full max-w-[720px] items-center justify-between rounded-full border border-black/10 bg-white/50 pl-8 pr-4 shadow-[0_12px_40px_rgba(0,0,0,.15)] backdrop-blur-sm"
            >
              <input
                name="prompt"
                aria-label="Describe the event you want to plan"
                placeholder="Plan a 500-person tech conference in Austin for March..."
                className="min-w-0 flex-1 bg-transparent text-base text-black outline-none placeholder:text-black/60"
              />
              <button
                type="submit"
                aria-label="Send"
                className="focus-ring flex size-12 shrink-0 items-center justify-center rounded-[24px] bg-black text-white"
              >
                <ArrowUp size={24} />
              </button>
            </form>

            <div className="flex w-full max-w-[720px] flex-col gap-8 rounded-[24px] border border-white/15 bg-[#1a1a1a] p-6 drop-shadow-[0_20px_24px_rgba(0,0,0,.4)] sm:p-10">
              <p className="text-base font-light leading-[1.6] text-white">
                I&apos;ve generated a comprehensive event plan framework based on your request. Below
                is the initial summary showing high-impact areas, budget allocations, and key
                milestones.
              </p>
              <hr className="border-white/15" />
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-white/40">
                  Key Event Plan Summary
                </h3>
                <dl className="flex flex-col">
                  {planSummary.map(({ label, pill, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-white/15 py-[14px]"
                    >
                      <dt className="flex items-center gap-4 text-[15px] font-medium text-white">
                        {label}
                        <span className="rounded-xl border border-white/15 bg-white/[.06] px-2 py-0.5 text-[11px] text-white/70">
                          {pill}
                        </span>
                      </dt>
                      <dd className="text-right text-[15px] text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex flex-col gap-16 bg-black px-6 pb-[60px] pt-[100px] lg:px-[120px]">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex w-[360px] max-w-full flex-col gap-6">
            <Logo textClassName="font-['Lora',serif] text-white" markSize={24} className="text-white" />
            <p className="text-white/70">The AI Event Operating System</p>
            <div className="flex gap-3">
              {socials.map(({ name, icon }) => (
                <a
                  key={name}
                  href="#social"
                  aria-label={name}
                  className="focus-ring flex size-9 items-center justify-center rounded-full border border-white/40"
                >
                  <img src={icon} alt="" className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            {footerColumns.map(({ title, links }) => (
              <div key={title} className="flex w-[150px] flex-col gap-5">
                <h2 className="font-medium text-white">{title}</h2>
                <ul className="flex flex-col gap-3 text-sm text-white/70">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} className="focus-ring">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] border border-white/15 bg-white/[.06] px-8 py-6"
        >
          <p className="text-lg text-white">Stay in the loop</p>
          <div className="flex w-[480px] max-w-full items-center gap-3">
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="Enter your email address"
              className="h-[52px] min-w-0 flex-1 rounded-full border border-white/15 bg-white/[.06] px-6 text-sm text-white outline-none placeholder:text-white/40"
            />
            <button type="submit" className="focus-ring h-[52px] rounded-full bg-white px-6 text-sm font-semibold text-black">
              Subscribe
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-white/40">
          <p>© 2026 Eccillo. All rights reserved.</p>
          <p>Privacy Policy · Terms of Service · Cookie Settings</p>
        </div>
      </footer>
    </div>
  );
}
