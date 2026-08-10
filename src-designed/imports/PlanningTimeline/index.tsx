import svgPaths from "./svg-6m0j7676yw";

function Sparkle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="sparkle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_1811)" id="sparkle">
          <path d={svgPaths.p36c88c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1811">
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
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black whitespace-nowrap">AI Operations Engine</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[rgba(0,0,0,0.64)] w-[min-content]">Scheduling anomaly detected: Catering load-in window directly overlaps AV heavy rigging check in Week 3. Recommending a 4-hour delay.</p>
    </div>
  );
}

function BannerCta() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Banner-CTA">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Resolve Conflict</p>
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

function FilterChip() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Chip">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">All Operations</p>
    </div>
  );
}

function FilterChip1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Chip">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">This Month</p>
    </div>
  );
}

function FilterChip2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Chip">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Q3 Deliverables</p>
    </div>
  );
}

function FilterChip3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Chip">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Milestones</p>
    </div>
  );
}

function FilterChips() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Filter-Chips">
      <FilterChip />
      <FilterChip1 />
      <FilterChip2 />
      <FilterChip3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Critical Path</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[10px]" data-name="Polygon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <path d="M5 0L10 5L5 10L0 5L5 0Z" fill="var(--fill-0, black)" id="Polygon" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Milestone</p>
    </div>
  );
}

function LegendIndicator() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="Legend-indicator">
      <Frame />
      <Frame1 />
    </div>
  );
}

function FilterHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Filter-Header">
      <FilterChips />
      <LegendIndicator />
    </div>
  );
}

function HeaderCategoryLabel() {
  return (
    <div className="content-stretch flex items-start p-[16px] relative shrink-0 w-[260px]" data-name="Header-Category-Label">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Operational Tracks</p>
    </div>
  );
}

function HeaderWeek() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W1: Planning</p>
        </div>
      </div>
    </div>
  );
}

function HeaderWeek1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W2: Prep</p>
        </div>
      </div>
    </div>
  );
}

function HeaderWeek2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W3: Coordination</p>
        </div>
      </div>
    </div>
  );
}

function HeaderWeek3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W4: Delivery</p>
        </div>
      </div>
    </div>
  );
}

function HeaderWeek4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W5: Onsite</p>
        </div>
      </div>
    </div>
  );
}

function HeaderWeek5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Header-Week">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[16px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">W6: Post</p>
        </div>
      </div>
    </div>
  );
}

function HeaderTimeGrid() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-name="Header-Time-Grid">
      <HeaderWeek />
      <HeaderWeek1 />
      <HeaderWeek2 />
      <HeaderWeek3 />
      <HeaderWeek4 />
      <HeaderWeek5 />
    </div>
  );
}

function GanttHeaderRow() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start relative shrink-0 w-full" data-name="Gantt-Header-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <HeaderCategoryLabel />
      <HeaderTimeGrid />
    </div>
  );
}

function Frame2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">{`Venue Booking & Permits`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Phase 1</p>
    </div>
  );
}

function CategoryName() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame2 />
    </div>
  );
}

function VerticalGridLines() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-0 px-[16px] right-[63.33%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines />
      <PhaseBar />
      <div className="-translate-y-1/2 absolute h-[14px] left-[34.67%] right-[61.33%] top-1/2" data-name="Milestone-Marker">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.2 14">
          <path d={svgPaths.p217721c0} fill="var(--fill-0, black)" id="Milestone-Marker" />
        </svg>
      </div>
    </div>
  );
}

function GanttDataRow() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <CategoryName />
      <RowPlotFrame />
    </div>
  );
}

function Frame3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">Catering Vendor Selection</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Phase 2</p>
    </div>
  );
}

function CategoryName1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame3 />
    </div>
  );
}

function VerticalGridLines1() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar1() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-1/4 opacity-64 px-[16px] right-[41.67%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame1() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines1 />
      <PhaseBar1 />
    </div>
  );
}

function GanttDataRow1() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <CategoryName1 />
      <RowPlotFrame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">{`AV Setup & Accoustics Check`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Phase 3</p>
    </div>
  );
}

function CategoryName2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame4 />
    </div>
  );
}

function VerticalGridLines2() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar2() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-[46.67%] opacity-40 px-[16px] right-[20%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame2() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines2 />
      <PhaseBar2 />
      <div className="-translate-y-1/2 absolute h-[14px] left-[78%] right-[18%] top-1/2" data-name="Milestone-Marker">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.2 14">
          <path d={svgPaths.p217721c0} fill="var(--fill-0, black)" id="Milestone-Marker" />
        </svg>
      </div>
    </div>
  );
}

function GanttDataRow2() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <CategoryName2 />
      <RowPlotFrame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">Marketing Campaign Launch</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Ongoing</p>
    </div>
  );
}

function CategoryName3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame5 />
    </div>
  );
}

function VerticalGridLines3() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar3() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-[13.33%] px-[16px] right-[8.33%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame3() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines3 />
      <PhaseBar3 />
    </div>
  );
}

function GanttDataRow3() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <CategoryName3 />
      <RowPlotFrame3 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">{`Logistics & Freight Route Setup`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Phase 4</p>
    </div>
  );
}

function CategoryName4() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame6 />
    </div>
  );
}

function VerticalGridLines4() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar4() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-[66.67%] opacity-64 px-[16px] right-[3.33%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame4() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines4 />
      <PhaseBar4 />
      <div className="-translate-y-1/2 absolute h-[14px] left-[94.67%] right-[1.33%] top-1/2" data-name="Milestone-Marker">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.2 14">
          <path d={svgPaths.p217721c0} fill="var(--fill-0, black)" id="Milestone-Marker" />
        </svg>
      </div>
    </div>
  );
}

function GanttDataRow4() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <CategoryName4 />
      <RowPlotFrame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[15px] text-black">{`Keynote Speakers & Prep`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Phase 3</p>
    </div>
  );
}

function CategoryName5() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center p-[20px] relative shrink-0 w-[260px]" data-name="Category-Name">
      <Frame7 />
    </div>
  );
}

function VerticalGridLines5() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between" data-name="Vertical-Grid-Lines">
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
      <div className="bg-[rgba(217,217,217,0.5)] h-full opacity-30 relative shrink-0 w-px" data-name="Rectangle" />
    </div>
  );
}

function PhaseBar5() {
  return (
    <div className="-translate-y-1/2 absolute bg-black content-stretch flex h-[32px] items-center left-[33.33%] opacity-40 px-[16px] right-[16.67%] rounded-[100px] top-1/2" data-name="Phase-Bar">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Active Period</p>
    </div>
  );
}

function RowPlotFrame5() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Row-Plot-Frame">
      <VerticalGridLines5 />
      <PhaseBar5 />
    </div>
  );
}

function GanttDataRow5() {
  return (
    <div className="content-stretch flex h-[80px] items-start relative shrink-0 w-full" data-name="Gantt-Data-Row">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <CategoryName5 />
      <RowPlotFrame5 />
    </div>
  );
}

function GanttGrid() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Gantt-Grid">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <GanttHeaderRow />
        <GanttDataRow />
        <GanttDataRow1 />
        <GanttDataRow2 />
        <GanttDataRow3 />
        <GanttDataRow4 />
        <GanttDataRow5 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Dashboard-Body">
      <div className="content-stretch flex flex-col gap-[28px] items-start p-[40px] relative size-full">
        <AiBanner />
        <FilterHeader />
        <GanttGrid />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Main-Content">
      <DashboardBody />
    </div>
  );
}

export default function PlanningTimeline() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="planning-timeline">
      <MainContent />
    </div>
  );
}