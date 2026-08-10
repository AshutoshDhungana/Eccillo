import svgPaths from "./svg-slbzhgh62b";

function MetricCard() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px] self-stretch" data-name="metric-card-0">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full whitespace-nowrap">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Total Capital Budget</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black">$120,000</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Allocated threshold</p>
      </div>
    </div>
  );
}

function MetricCard1() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px] self-stretch" data-name="metric-card-1">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full whitespace-nowrap">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Spent-To-Date</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black">$76,450</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">63.7% of limit</p>
      </div>
    </div>
  );
}

function MetricCard2() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px] self-stretch" data-name="metric-card-2">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full whitespace-nowrap">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Remaining Balance</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black">$43,550</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">Under projection</p>
      </div>
    </div>
  );
}

function MetricCard3() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-w-px relative rounded-[16px] self-stretch" data-name="metric-card-3">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start leading-[normal] p-[24px] relative size-full whitespace-nowrap">
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Projected Overrun</p>
        <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[36px] text-black">$1,200</p>
        <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">AI forecasted risk</p>
      </div>
    </div>
  );
}

function MetricsRow() {
  return (
    <div className="content-stretch flex gap-[16px] h-[150px] items-start relative shrink-0 w-full" data-name="Metrics-Row">
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
        <p className="flex-[1_0_0] min-w-px relative">Category</p>
        <p className="relative shrink-0 text-right w-[110px]">Allocated</p>
        <p className="relative shrink-0 text-right w-[110px]">Spent</p>
        <p className="relative shrink-0 text-right w-[110px]">Remaining</p>
      </div>
    </div>
  );
}

function MiniProgressBar() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[4px] items-start relative rounded-[10px] shrink-0 w-[140px]" data-name="Mini-Progress-Bar">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[140px]" data-name="Rectangle" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Venue Rental</p>
      <MiniProgressBar />
    </div>
  );
}

function TableRow() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$45,000</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$45,000</p>
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$0</p>
        </div>
      </div>
    </div>
  );
}

function MiniProgressBar1() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[4px] items-start relative rounded-[10px] shrink-0 w-[140px]" data-name="Mini-Progress-Bar">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[101px]" data-name="Rectangle" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Audio/Visual Operations</p>
      <MiniProgressBar1 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Table-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame1 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$25,000</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$18,200</p>
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$6,800</p>
        </div>
      </div>
    </div>
  );
}

function MiniProgressBar2() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[4px] items-start relative rounded-[10px] shrink-0 w-[140px]" data-name="Mini-Progress-Bar">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[52px]" data-name="Rectangle" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Catering Services</p>
      <MiniProgressBar2 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame2 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$30,000</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$11,250</p>
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$18,750</p>
        </div>
      </div>
    </div>
  );
}

function MiniProgressBar3() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[4px] items-start relative rounded-[10px] shrink-0 w-[140px]" data-name="Mini-Progress-Bar">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[22px]" data-name="Rectangle" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">{`Event Collateral & Promo`}</p>
      <MiniProgressBar3 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Table-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame3 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$12,000</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$2,000</p>
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$10,000</p>
        </div>
      </div>
    </div>
  );
}

function MiniProgressBar4() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[4px] items-start relative rounded-[10px] shrink-0 w-[140px]" data-name="Mini-Progress-Bar">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-0" data-name="Rectangle" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">Speaker Honorariums</p>
      <MiniProgressBar4 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table-Row">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame4 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$8,000</p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$0</p>
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-right w-[110px]">$8,000</p>
        </div>
      </div>
    </div>
  );
}

function AllocationTableContainer() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[16px]" data-name="Allocation-Table-Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TableHeader />
        <TableRow />
        <TableRow1 />
        <TableRow2 />
        <TableRow3 />
        <TableRow4 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function DonutCenter() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute content-stretch flex flex-col font-normal gap-[2px] items-center leading-[normal] left-1/2 top-1/2 whitespace-nowrap" data-name="Donut-Center">
      <p className="font-['Lora:Regular',sans-serif] relative shrink-0 text-[22px] text-black">63%</p>
      <p className="font-['Inter:Regular',sans-serif] not-italic relative shrink-0 text-[10px] text-[rgba(0,0,0,0.4)] uppercase">Committed</p>
    </div>
  );
}

function DonutWrapper() {
  return (
    <div className="content-stretch flex flex-col h-[180px] items-center justify-center relative shrink-0 w-[160px]" data-name="donut-wrapper">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[140px] top-1/2" data-name="donut-base">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 140">
          <path d={svgPaths.p3aec0000} fill="var(--fill-0, #F5F5F5)" id="donut-base" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[140px] top-1/2" data-name="segment-venue">
        <div className="absolute bottom-0 left-1/4 right-0 top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 105 140">
            <path d={svgPaths.p279e7c00} fill="var(--fill-0, black)" id="segment-venue" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[140px] top-1/2" data-name="segment-av">
        <div className="absolute bottom-[6.7%] left-0 right-[67.5%] top-1/4">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45.5 95.6218">
            <path d={svgPaths.p25216580} fill="var(--fill-0, black)" id="segment-av" opacity="0.64" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[140px] top-1/2" data-name="segment-catering">
        <div className="absolute bottom-[67.5%] left-[6.7%] right-1/2 top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.6218 45.5">
            <path d={svgPaths.p3c154600} fill="var(--fill-0, black)" id="segment-catering" opacity="0.4" />
          </svg>
        </div>
      </div>
      <DonutCenter />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[10px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, black)" id="Ellipse" r="5" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Venue Rental</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
      <Frame6 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">58.8%</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[10px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, black)" id="Ellipse" opacity="0.64" r="5" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">AV Operations</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
      <Frame8 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">23.8%</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[10px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, black)" id="Ellipse" opacity="0.4" r="5" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Catering</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Frame">
      <Frame10 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">14.7%</p>
    </div>
  );
}

function DonutLegend() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Donut-Legend">
      <Frame5 />
      <Frame7 />
      <Frame9 />
    </div>
  );
}

function DonutChartCard() {
  return (
    <div className="relative rounded-[16px] self-stretch shrink-0 w-[380px]" data-name="Donut-Chart-Card">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[20px] items-center justify-center p-[24px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[15px] text-[rgba(0,0,0,0.64)] w-[min-content]">Expenditure Distribution</p>
          <DonutWrapper />
          <DonutLegend />
        </div>
      </div>
    </div>
  );
}

function AllocationDonutSection() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Allocation-Donut-Section">
      <AllocationTableContainer />
      <DonutChartCard />
    </div>
  );
}

function Frame11() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[24px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]">Jan 14</p>
      <p className="relative shrink-0 text-[15px] text-black">Metropolitan Plaza Corp</p>
    </div>
  );
}

function StatusBadge() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Status-Badge">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">Paid</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">-$45,000</p>
      <StatusBadge />
    </div>
  );
}

function TransactionRow() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Transaction-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame11 />
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[24px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]">Jan 12</p>
      <p className="relative shrink-0 text-[15px] text-black">Acoustic Prime Sound</p>
    </div>
  );
}

function StatusBadge1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Status-Badge">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">Paid</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">-$12,400</p>
      <StatusBadge1 />
    </div>
  );
}

function TransactionRow1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Transaction-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame13 />
          <Frame14 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[24px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]">Jan 10</p>
      <p className="relative shrink-0 text-[15px] text-black">Elegance Fine Dining</p>
    </div>
  );
}

function StatusBadge2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-start opacity-64 px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Status-Badge">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">Pending</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">-$5,625</p>
      <StatusBadge2 />
    </div>
  );
}

function TransactionRow2() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Transaction-Row">
      <div aria-hidden className="absolute border-[rgba(217,217,217,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame15 />
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[24px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)]">Jan 08</p>
      <p className="relative shrink-0 text-[15px] text-black">Prism Print Agency</p>
    </div>
  );
}

function StatusBadge3() {
  return (
    <div className="bg-black content-stretch flex items-start px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="Status-Badge">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Overdue</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-black whitespace-nowrap">-$2,000</p>
      <StatusBadge3 />
    </div>
  );
}

function TransactionRow3() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Transaction-Row">
      <div aria-hidden className="absolute border-0 border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame17 />
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function TransactionsList() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Transactions-List">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TransactionRow />
        <TransactionRow1 />
        <TransactionRow2 />
        <TransactionRow3 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function TransactionsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Transactions-Container">
      <p className="[word-break:break-word] font-['Lora:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[22px] text-black whitespace-nowrap">Recent General Ledger Transactions</p>
      <TransactionsList />
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Dashboard-Body">
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[40px] relative size-full">
        <MetricsRow />
        <AllocationDonutSection />
        <TransactionsContainer />
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

export default function PlanningBudget() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="planning-budget">
      <MainContent />
    </div>
  );
}