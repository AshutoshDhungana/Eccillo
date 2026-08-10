import svgPaths from "./svg-g5swsorjx4";

function Sparkle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="sparkle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_2298)" id="sparkle">
          <path d={svgPaths.p36c88c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_2298">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SparkleIcon() {
  return (
    <div className="bg-black content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[36px]" data-name="Sparkle-Icon">
      <Sparkle />
    </div>
  );
}

function BannerText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative text-[14px]" data-name="Banner-Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black whitespace-nowrap">{`AI Risk Analysis & Mitigation Engine`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[rgba(0,0,0,0.64)] w-[min-content]">Scheduling anomaly detected: Catering load-in window directly overlaps AV heavy rigging check in Week 3. Recommending a 4-hour delay.</p>
    </div>
  );
}

function BannerCta() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Banner-CTA">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Auto-Mitigate</p>
    </div>
  );
}

function AiBanner() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="AI-Banner">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[20px] relative size-full">
          <SparkleIcon />
          <BannerText />
          <BannerCta />
        </div>
      </div>
    </div>
  );
}

function MetricCard() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-full">Total Identified Risks</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black w-full">14</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">Across all sub-tracks</p>
      </div>
    </div>
  );
}

function MetricCard1() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-full">High Priority Risks</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black w-full">3</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">Requires immediate focus</p>
      </div>
    </div>
  );
}

function MetricCard2() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-full">Successfully Mitigated</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black w-full">8</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">Closed out this month</p>
      </div>
    </div>
  );
}

function MetricCard3() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-full">Open / Mitigating</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black w-full">6</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">Active risk track active</p>
      </div>
    </div>
  );
}

function MetricsRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Metrics-Row">
      <MetricCard />
      <MetricCard1 />
      <MetricCard2 />
      <MetricCard3 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Table-Header">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold items-start leading-[normal] not-italic p-[16px] relative size-full text-[14px] text-[rgba(0,0,0,0.64)]">
        <p className="flex-[1_0_0] min-w-px relative">Risk Item</p>
        <p className="relative shrink-0 w-[100px]">Category</p>
        <p className="relative shrink-0 w-[100px]">Likelihood</p>
        <p className="relative shrink-0 w-[100px]">Impact</p>
        <p className="relative shrink-0 w-[120px]">Status</p>
        <p className="relative shrink-0 w-[110px]">Owner</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.6" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Med</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[rgba(0,0,0,0.64)] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Mitigating</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
      <Frame4 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[14px] text-black">Thunderstorm during keynote session</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[100px]">Weather</p>
          <Frame1 />
          <Frame2 />
          <Frame3 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[110px]">Sarah K.</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Open</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
      <Frame9 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[14px] text-black">Rigging structural safety permit delay</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[100px]">Venue</p>
          <Frame6 />
          <Frame7 />
          <Frame8 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[110px]">Alex T.</p>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.3" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Low</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">Resolved</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
      <Frame14 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[14px] text-black">Keynote presenter travel scheduling conflict</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[100px]">Vendor</p>
          <Frame11 />
          <Frame12 />
          <Frame13 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[110px]">Lisa M.</p>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.6" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Med</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.6" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Med</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Open</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
      <Frame19 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[14px] text-black">Catering staffing shortfall</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[100px]">Vendor</p>
          <Frame16 />
          <Frame17 />
          <Frame18 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[110px]">John D.</p>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.3" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Low</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[rgba(0,0,0,0.64)] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Mitigating</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
      <Frame24 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[14px] text-black">AV main backup generator offline</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[100px]">Technical</p>
          <Frame21 />
          <Frame22 />
          <Frame23 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] w-[110px]">Sarah K.</p>
        </div>
      </div>
    </div>
  );
}

function RiskRegisterContainer() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="Risk-Register-Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TableHeader />
        <Frame />
        <Frame5 />
        <Frame10 />
        <Frame15 />
        <Frame20 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame26() {
  return <div className="h-[20px] relative shrink-0 w-[40px]" data-name="Frame" />;
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame26 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[11px] text-[rgba(0,0,0,0.4)] text-center">L</p>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[11px] text-[rgba(0,0,0,0.4)] text-center">M</p>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-px not-italic relative text-[11px] text-[rgba(0,0,0,0.4)] text-center">H</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-[rgba(0,0,0,0.4)] w-[40px]">High</p>
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-20 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-60 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-90 relative rounded-[6px]" data-name="heat-cell" />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-[rgba(0,0,0,0.4)] w-[40px]">Med</p>
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-10 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-40 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-70 relative rounded-[6px]" data-name="heat-cell" />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-[rgba(0,0,0,0.4)] w-[40px]">Low</p>
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-5 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-20 relative rounded-[6px]" data-name="heat-cell" />
      <div className="bg-black flex-[1_0_0] h-[60px] min-w-px opacity-30 relative rounded-[6px]" data-name="heat-cell" />
    </div>
  );
}

function Heatgrid() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Heatgrid">
      <Frame25 />
      <Frame27 />
      <Frame28 />
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <div className="bg-black opacity-10 relative rounded-[2px] shrink-0 size-[12px]" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Low Risk</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <div className="bg-black opacity-90 relative rounded-[2px] shrink-0 size-[12px]" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">High Risk</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame31 />
      <Frame32 />
    </div>
  );
}

function HeatmapContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[380px]" data-name="Heatmap-Container">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Lora:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[20px] text-black w-full">Concentration Matrix</p>
      <Heatgrid />
      <Frame30 />
    </div>
  );
}

function TableHeatmapRow() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Table-Heatmap-Row">
      <RiskRegisterContainer />
      <HeatmapContainer />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[4px] shrink-0 size-[18px]" data-name="checkbox">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Checkbox />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Review backup indoor stage layout for outdoor keynote swap</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">High</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due Jan 19</p>
      <Frame35 />
    </div>
  );
}

function TaskRow() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Task-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame33 />
          <Frame34 />
        </div>
      </div>
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[4px] shrink-0 size-[18px]" data-name="checkbox">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Checkbox1 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Execute urgent liquor license waiver signature</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Medium</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due Jan 20</p>
      <Frame38 />
    </div>
  );
}

function TaskRow1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Task-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame36 />
          <Frame37 />
        </div>
      </div>
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[4px] shrink-0 size-[18px]" data-name="checkbox">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Checkbox2 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Draft speaker alternative standby itinerary options</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Low</p>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due Jan 22</p>
      <Frame41 />
    </div>
  );
}

function TaskRow2() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Task-Row">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame39 />
          <Frame40 />
        </div>
      </div>
    </div>
  );
}

function TasksList() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Tasks-List">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TaskRow />
        <TaskRow1 />
        <TaskRow2 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function MitigationsSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Mitigations-Section">
      <p className="[word-break:break-word] font-['Lora:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[22px] text-black whitespace-nowrap">Required Mitigation Actions</p>
      <TasksList />
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Dashboard-Body">
      <div className="content-stretch flex flex-col gap-[28px] items-start p-[40px] relative size-full">
        <AiBanner />
        <MetricsRow />
        <TableHeatmapRow />
        <MitigationsSection />
      </div>
    </div>
  );
}

function MainContentColumn() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Main-Content-Column">
      <DashboardBody />
    </div>
  );
}

export default function PlanningRisks() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="planning-risks">
      <MainContentColumn />
    </div>
  );
}