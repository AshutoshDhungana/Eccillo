import svgPaths from "./svg-rbpm6m01fz";

function ChevronLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-left">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-left">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PrevMonth() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start p-[8px] relative rounded-[100px] shrink-0" data-name="Prev-Month">
      <ChevronLeft />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function NextMonth() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start p-[8px] relative rounded-[100px] shrink-0" data-name="Next-Month">
      <ChevronRight />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <PrevMonth />
      <p className="[word-break:break-word] font-['Lora:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[22px] text-black whitespace-nowrap">January 2026</p>
      <NextMonth />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Today</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Month</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Week</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Day</p>
    </div>
  );
}

function Toggles() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[100px] shrink-0" data-name="Toggles">
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Frame">
      <Frame2 />
      <Toggles />
    </div>
  );
}

function CalendarControls() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Calendar-Controls">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">MON</p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">TUE</p>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">WED</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">THU</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">FRI</p>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">SAT</p>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">SUN</p>
        </div>
      </div>
    </div>
  );
}

function DaysHeaderRow() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start relative shrink-0 w-full" data-name="Days-Header-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame15() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame14() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">29</p>
      <Frame15 />
    </div>
  );
}

function Frame17() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">30</p>
      <Frame17 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-black opacity-40 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Permit Filing</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame20 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">1</p>
      <Frame19 />
    </div>
  );
}

function Frame22() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame21() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">2</p>
      <Frame22 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-black opacity-60 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Catering Pitch</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame25 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">3</p>
      <Frame24 />
    </div>
  );
}

function Frame27() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame26() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">4</p>
      <Frame27 />
    </div>
  );
}

function Frame29() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame28() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">5</p>
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame30() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">6</p>
      <Frame31 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-black opacity-80 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Audio Setup</p>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame34 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">7</p>
      <Frame33 />
    </div>
  );
}

function Frame36() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame35() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">8</p>
      <Frame36 />
    </div>
  );
}

function Frame38() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame37() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">9</p>
      <Frame38 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-black opacity-40 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Keynote Align</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame41 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">10</p>
      <Frame40 />
    </div>
  );
}

function Frame43() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame42() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">11</p>
      <Frame43 />
    </div>
  );
}

function Frame45() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame44() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">12</p>
      <Frame45 />
    </div>
  );
}

function Frame47() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame46() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">13</p>
      <Frame47 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="bg-black opacity-90 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Gala Logistics</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="bg-black opacity-60 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Safety Check</p>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex flex-col gap-[6px] inset-[14px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">14</p>
      <Frame49 />
    </div>
  );
}

function Frame53() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame52() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">15</p>
      <Frame53 />
    </div>
  );
}

function Frame55() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame54() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">16</p>
      <Frame55 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-black opacity-30 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Speaker Standby</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame58 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">17</p>
      <Frame57 />
    </div>
  );
}

function Frame60() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame59() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">18</p>
      <Frame60 />
    </div>
  );
}

function Frame62() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame61() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">19</p>
      <Frame62 />
    </div>
  );
}

function Frame64() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame63() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">20</p>
      <Frame64 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="bg-black opacity-80 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Stage Rigging</p>
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame67 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">21</p>
      <Frame66 />
    </div>
  );
}

function Frame69() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame68() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">22</p>
      <Frame69 />
    </div>
  );
}

function Frame71() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame70() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">23</p>
      <Frame71 />
    </div>
  );
}

function Frame73() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame72() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">24</p>
      <Frame73 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="bg-black opacity-50 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">AV Rehearsal</p>
      </div>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame76 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">25</p>
      <Frame75 />
    </div>
  );
}

function Frame78() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame77() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">26</p>
      <Frame78 />
    </div>
  );
}

function Frame80() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame79() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">27</p>
      <Frame80 />
    </div>
  );
}

function Frame82() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame81() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">28</p>
      <Frame82 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="bg-black opacity-40 relative rounded-[4px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex items-start px-[6px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">Wrap-up Meeting</p>
      </div>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame85 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[23px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">29</p>
      <Frame84 />
    </div>
  );
}

function Frame87() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame86() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">30</p>
      <Frame87 />
    </div>
  );
}

function Frame89() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame88() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">31</p>
      <Frame89 />
    </div>
  );
}

function Frame91() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame90() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">1</p>
      <Frame91 />
    </div>
  );
}

function Frame93() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Frame" />;
}

function Frame92() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] inset-[-19px_0] items-start p-[8px]" data-name="Frame">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">2</p>
      <Frame93 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Frame">
      <Frame14 />
      <Frame16 />
      <Frame18 />
      <Frame21 />
      <Frame23 />
      <Frame26 />
      <Frame28 />
      <Frame30 />
      <Frame32 />
      <Frame35 />
      <Frame37 />
      <Frame39 />
      <Frame42 />
      <Frame44 />
      <Frame46 />
      <Frame48 />
      <Frame52 />
      <Frame54 />
      <Frame56 />
      <Frame59 />
      <Frame61 />
      <Frame63 />
      <Frame65 />
      <Frame68 />
      <Frame70 />
      <Frame72 />
      <Frame74 />
      <Frame77 />
      <Frame79 />
      <Frame81 />
      <Frame83 />
      <Frame86 />
      <Frame88 />
      <Frame90 />
      <Frame92 />
    </div>
  );
}

function CalendarGridContainer() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Calendar-Grid-Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <DaysHeaderRow />
        <Frame13 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">AV Rehearsal Final Schedule Lock</p>
    </div>
  );
}

function Frame98() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Review</p>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">2 days left</p>
      <Frame98 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame96 />
          <Frame97 />
        </div>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Liquor License Waiver Upload</p>
    </div>
  );
}

function Frame102() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Sign</p>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">4 days left</p>
      <Frame102 />
    </div>
  );
}

function Frame99() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame100 />
          <Frame101 />
        </div>
      </div>
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Staff Catering Dietary Alignment</p>
    </div>
  );
}

function Frame106() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[6px] relative rounded-[100px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">Confirm</p>
    </div>
  );
}

function Frame105() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">7 days left</p>
      <Frame106 />
    </div>
  );
}

function Frame103() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame104 />
          <Frame105 />
        </div>
      </div>
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame95 />
      <Frame99 />
      <Frame103 />
    </div>
  );
}

function UpcomingDeadlines() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Upcoming-Deadlines">
      <p className="[word-break:break-word] font-['Lora:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[18px] text-black whitespace-nowrap">Upcoming Deadlines</p>
      <Frame94 />
    </div>
  );
}

function CalendarWorkspace() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Calendar-Workspace">
      <CalendarControls />
      <CalendarGridContainer />
      <UpcomingDeadlines />
    </div>
  );
}

function Frame107() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] uppercase">Agenda for Selected Day</p>
      <p className="font-['Lora:Medium',sans-serif] font-medium relative shrink-0 text-[22px] text-black">Thursday, Jan 14</p>
    </div>
  );
}

function Frame110() {
  return (
    <div className="bg-black content-stretch flex items-start opacity-80 px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Technical</p>
    </div>
  );
}

function Frame109() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">10:00 AM · main stage</p>
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]">{`Stage Rigging Check & Setup`}</p>
        <Frame110 />
      </div>
    </div>
  );
}

function Frame112() {
  return (
    <div className="bg-black content-stretch flex items-start opacity-60 px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">Logistics</p>
    </div>
  );
}

function Frame111() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[11px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">2:00 PM · catering hall</p>
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]">Catering Vendor Final Tasting</p>
        <Frame112 />
      </div>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame109 />
      <Frame111 />
    </div>
  );
}

function Sparkle() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="sparkle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_2547)" id="sparkle">
          <path d={svgPaths.p216e3400} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_2547">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <Sparkle />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">AI Recommendation</p>
    </div>
  );
}

function Frame114() {
  return (
    <div className="bg-black relative rounded-[100px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Reschedule AV Rehearsal</p>
        </div>
      </div>
    </div>
  );
}

function AiSuggestion() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="AI-Suggestion">
      <Frame113 />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] w-[min-content]">AI recommends rescheduling AV rehearsal to avoid conflict.</p>
      <Frame114 />
    </div>
  );
}

function AgendaSidebar() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[320px]" data-name="Agenda-Sidebar">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame107 />
      <Frame108 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <line id="Line" stroke="var(--stroke-0, #D9D9D9)" strokeOpacity="0.501961" x2="272" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <AiSuggestion />
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Dashboard-Body">
      <div className="content-stretch flex gap-[28px] items-start p-[40px] relative size-full">
        <CalendarWorkspace />
        <AgendaSidebar />
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

export default function PlanningCalendar() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="planning-calendar">
      <MainContentColumn />
    </div>
  );
}