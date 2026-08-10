import svgPaths from "./svg-l0ygznknlw";

function Frame() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[8px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Total Tasks:</p>
      <p className="relative shrink-0 text-[16px] text-black">24</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[8px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Completed Operations:</p>
      <p className="relative shrink-0 text-[16px] text-black">14</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[8px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="relative shrink-0 text-[14px] text-[rgba(0,0,0,0.64)]">Active Issues / Overdue:</p>
      <p className="relative shrink-0 text-[16px] text-black">3</p>
    </div>
  );
}

function SummaryBar() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="Summary-Bar">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex gap-[40px] items-start px-[24px] py-[16px] relative size-full">
        <Frame />
        <div className="bg-[rgba(217,217,217,0.5)] h-[16px] relative shrink-0 w-px" data-name="Rectangle" />
        <Frame1 />
        <div className="bg-[rgba(217,217,217,0.5)] h-[16px] relative shrink-0 w-px" data-name="Rectangle" />
        <Frame2 />
      </div>
    </div>
  );
}

function FilterTab() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Tab-0">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">All Tasks</p>
    </div>
  );
}

function FilterTab1() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Tab-1">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">To Do</p>
    </div>
  );
}

function FilterTab2() {
  return (
    <div className="bg-black content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Tab-2">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">In Progress</p>
    </div>
  );
}

function FilterTab3() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Tab-3">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Completed</p>
    </div>
  );
}

function FilterTab4() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-name="Filter-Tab-4">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">Overdue</p>
    </div>
  );
}

function FilterTabs() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Filter-Tabs">
      <FilterTab />
      <FilterTab1 />
      <FilterTab2 />
      <FilterTab3 />
      <FilterTab4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] uppercase whitespace-nowrap">high</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Assignee: Sarah K</p>
      <div className="relative shrink-0 size-[4px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.501961" id="Ellipse" r="2" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due date: Jan 18</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Finalize fire marshal structural safety permit</p>
      <Frame6 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-w-px relative" data-name="Frame">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function TrackProgress() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[160px]" data-name="Track-Progress">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[160px]" data-name="Rectangle" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-end relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">100% Complete</p>
      <TrackProgress />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <Frame8 />
    </div>
  );
}

function TaskCard() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="Task-Card-0">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Frame3 />
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.64" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] uppercase whitespace-nowrap">medium</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Assignee: Alex T</p>
      <div className="relative shrink-0 size-[4px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.501961" id="Ellipse" r="2" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due date: Jan 22</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Coordinate heavy load-in vehicle parking route</p>
      <Frame12 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-w-px relative" data-name="Frame">
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function TrackProgress1() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[160px]" data-name="Track-Progress">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[72px]" data-name="Rectangle" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-end relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">45% Complete</p>
      <TrackProgress1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <Frame14 />
    </div>
  );
}

function TaskCard1() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="Task-Card-1">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Frame9 />
          <Frame13 />
        </div>
      </div>
    </div>
  );
}

function GroupCardsGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Group-Cards-Grid">
      <TaskCard />
      <TaskCard1 />
    </div>
  );
}

function Group() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Group-0">
      <p className="[word-break:break-word] font-['Lora:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[22px] text-black whitespace-nowrap">{`Venue & Onsite Logistics`}</p>
      <GroupCardsGrid />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" opacity="0.4" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] uppercase whitespace-nowrap">low</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Assignee: Lisa M</p>
      <div className="relative shrink-0 size-[4px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.501961" id="Ellipse" r="2" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due date: Jan 15</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Review custom vegetarian menu dietary constraints</p>
      <Frame18 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-w-px relative" data-name="Frame">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function TrackProgress2() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[160px]" data-name="Track-Progress">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[128px]" data-name="Rectangle" />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-end relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">80% Complete</p>
      <TrackProgress2 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <Frame20 />
    </div>
  );
}

function TaskCard2() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="Task-Card-0">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Frame15 />
          <Frame19 />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[100px]" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, black)" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] uppercase whitespace-nowrap">high</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Assignee: John D</p>
      <div className="relative shrink-0 size-[4px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #D9D9D9)" fillOpacity="0.501961" id="Ellipse" r="2" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">Due date: Jan 20</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Execute primary liquor license waiver</p>
      <Frame24 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-w-px relative" data-name="Frame">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function TrackProgress3() {
  return (
    <div className="bg-[rgba(217,217,217,0.5)] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[160px]" data-name="Track-Progress">
      <div className="bg-black h-full relative rounded-[10px] shrink-0 w-[32px]" data-name="Rectangle" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-end relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.64)] whitespace-nowrap">20% Complete</p>
      <TrackProgress3 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <Frame26 />
    </div>
  );
}

function TaskCard3() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[16px] shrink-0 w-full" data-name="Task-Card-1">
      <div aria-hidden className="absolute border border-[rgba(217,217,217,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Frame21 />
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function GroupCardsGrid1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Group-Cards-Grid">
      <TaskCard2 />
      <TaskCard3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Group-1">
      <p className="[word-break:break-word] font-['Lora:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[22px] text-black whitespace-nowrap">{`Catering & Services Coordination`}</p>
      <GroupCardsGrid1 />
    </div>
  );
}

function TaskGroupsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Task-Groups-Container">
      <Group />
      <Group1 />
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Dashboard-Body">
      <div className="content-stretch flex flex-col gap-[28px] items-start p-[40px] relative size-full">
        <SummaryBar />
        <FilterTabs />
        <TaskGroupsContainer />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start" data-name="Main-Content">
      <DashboardBody />
    </div>
  );
}

function Sparkle() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="sparkle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_2106)" id="sparkle">
          <path d={svgPaths.p1101d680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_2106">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AiFloatingPill() {
  return (
    <div className="absolute bg-black bottom-[40px] content-stretch drop-shadow-[0px_12px_12px_rgba(0,0,0,0.24)] flex gap-[10px] items-center px-[24px] py-[14px] right-[40px] rounded-[200px]" data-name="AI-Floating-Pill">
      <Sparkle />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Ask AI to prioritize</p>
    </div>
  );
}

function MainWrapperRelative() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="Main-Wrapper-Relative">
      <MainContent />
      <AiFloatingPill />
    </div>
  );
}

export default function PlanningTasks() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="planning-tasks">
      <MainWrapperRelative />
    </div>
  );
}