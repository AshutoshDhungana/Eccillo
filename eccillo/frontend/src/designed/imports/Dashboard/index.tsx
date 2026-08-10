import svgPaths from "./svg-z3krs3im6w";

function LogoWhite() {
  return (
    <div className="h-[29.999px] relative shrink-0 w-[31.648px]" data-name="Logo_white">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.6475 29.999">
        <g id="Logo_white">
          <path clipRule="evenodd" d={svgPaths.p177f7a80} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p38a0a300} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 w-full" data-name="Logo">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pl-[35px] pr-[15px] relative size-full">
          <LogoWhite />
          <div className="[word-break:break-word] flex flex-col font-['Helvetica_Now_Display:Medium',sans-serif] h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-white w-[94px]">
            <p className="leading-[normal]">Eccillo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayoutDashboard() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="layout-dashboard">
          <g id="Vector">
            <path d={svgPaths.p2f7c3ff0} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p772e900} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p99ad200} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p3fc0d440} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function NavItemDashboard() {
  return (
    <div className="bg-white relative rounded-[10.3px] shrink-0 w-full" data-name="Nav_Item_Dashboard">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10.3px] items-center px-[12.36px] py-[8.24px] relative size-full">
          <LayoutDashboard />
          <p className="[word-break:break-word] flex-[1_0_0] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[24px] text-black">Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function CalendarCheck() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="calendar-check">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="calendar-check">
          <path d={svgPaths.p26d74000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function NavItemEvents() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="Nav_Item_Events">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pb-[8px] px-[12px] relative size-full">
          <CalendarCheck />
          <p className="[word-break:break-word] flex-[1_0_0] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[24px] text-white">Events</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="section-header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[24px] whitespace-nowrap">Planning</p>
        </div>
      </div>
    </div>
  );
}

function ChartGantt() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="chart-gantt">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="chart-gantt">
          <path d={svgPaths.p31a38e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemTimeline() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-timeline">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <ChartGantt />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Timeline</p>
        </div>
      </div>
    </div>
  );
}

function Wallet() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="wallet">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="wallet">
          <path d={svgPaths.p378b48c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemBudget() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-budget">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Wallet />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Budget</p>
        </div>
      </div>
    </div>
  );
}

function CheckSquare() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check-square">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check-square">
          <path d={svgPaths.p3dd3d760} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemTasks() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-tasks">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <CheckSquare />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Tasks</p>
        </div>
      </div>
    </div>
  );
}

function CalendarDays() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="calendar-days">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="calendar-days">
          <path d={svgPaths.p31bd7b00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemCalendar() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-calendar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <CalendarDays />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Calendar</p>
        </div>
      </div>
    </div>
  );
}

function ListChecks() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="list-checks">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="list-checks">
          <path d={svgPaths.p3f201d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemChecklist() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-checklist">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <ListChecks />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Risks</p>
        </div>
      </div>
    </div>
  );
}

function Items() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="items">
      <ItemTimeline />
      <ItemBudget />
      <ItemTasks />
      <ItemCalendar />
      <ItemChecklist />
    </div>
  );
}

function SectionPlanning() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[10px] relative shrink-0 w-full" data-name="section-planning">
      <SectionHeader />
      <Items />
    </div>
  );
}

function SectionHeader1() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="section-header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[24px] whitespace-nowrap">Find</p>
        </div>
      </div>
    </div>
  );
}

function MapPin() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="map-pin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="map-pin">
          <path d={svgPaths.p22a7a550} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemVenue() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-venue">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <MapPin />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Vendor</p>
        </div>
      </div>
    </div>
  );
}

function BadgeDollarSign() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="badge-dollar-sign">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_1441)" id="badge-dollar-sign">
          <path d={svgPaths.p2aec0000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1441">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemSponsor() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-sponsor">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <BadgeDollarSign />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Sponsor</p>
        </div>
      </div>
    </div>
  );
}

function Users() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="users">
          <path d={svgPaths.p4264400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemVolunteer() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-volunteer">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Users />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Talents</p>
        </div>
      </div>
    </div>
  );
}

function Items1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="items">
      <ItemVenue />
      <ItemSponsor />
      <ItemVolunteer />
    </div>
  );
}

function SectionFind() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-find">
      <SectionHeader1 />
      <Items1 />
    </div>
  );
}

function SectionHeader2() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="section-header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[24px] whitespace-nowrap">Execute</p>
        </div>
      </div>
    </div>
  );
}

function BarChart() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="bar-chart-3">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="bar-chart-3">
          <path d={svgPaths.p1a331600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemProcurement() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-procurement">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <BarChart />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Procurement</p>
        </div>
      </div>
    </div>
  );
}

function ClipboardList() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="clipboard-list">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="clipboard-list">
          <path d={svgPaths.p3d335d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemRegistration() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-registration">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <ClipboardList />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Registration</p>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="calendar">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="calendar">
          <path d={svgPaths.p16e2f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemAgenda() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-agenda">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Calendar />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Agenda</p>
        </div>
      </div>
    </div>
  );
}

function Ticket() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="ticket">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="ticket">
          <path d={svgPaths.p32b45680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemTickets() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-tickets">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Ticket />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Tickets</p>
        </div>
      </div>
    </div>
  );
}

function LogIn() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="log-in">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="log-in">
          <path d={svgPaths.p11bc6a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemCheckIn() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-check-in">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <LogIn />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Check-in</p>
        </div>
      </div>
    </div>
  );
}

function QrCode() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="qr-code">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="qr-code">
          <path d={svgPaths.p17439270} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemQr() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-qr">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <QrCode />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">QR</p>
        </div>
      </div>
    </div>
  );
}

function Bell() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="bell">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="bell">
          <path d={svgPaths.p13cb380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemNotifications() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-notifications">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Bell />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Notifications</p>
        </div>
      </div>
    </div>
  );
}

function BarChart1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="bar-chart-3">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="bar-chart-3">
          <path d={svgPaths.p1a331600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemLivePolls() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-live-polls">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <BarChart1 />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Live Polls</p>
        </div>
      </div>
    </div>
  );
}

function Items2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="items">
      <ItemProcurement />
      <ItemRegistration />
      <ItemAgenda />
      <ItemTickets />
      <ItemCheckIn />
      <ItemQr />
      <ItemNotifications />
      <ItemLivePolls />
    </div>
  );
}

function SectionExecute() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-execute">
      <SectionHeader2 />
      <Items2 />
    </div>
  );
}

function SectionHeader3() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="section-header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[24px] whitespace-nowrap">Collaborate</p>
        </div>
      </div>
    </div>
  );
}

function Users1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="users">
          <path d={svgPaths.p4264400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemInternalTeam() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-internal-team">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Users1 />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Internal Team</p>
        </div>
      </div>
    </div>
  );
}

function Briefcase() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="briefcase">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="briefcase">
          <path d={svgPaths.p21d12600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemVendors() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-vendors">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Briefcase />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Vendors</p>
        </div>
      </div>
    </div>
  );
}

function BadgeDollarSign1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="badge-dollar-sign">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_1441)" id="badge-dollar-sign">
          <path d={svgPaths.p2aec0000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1441">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemSponsors() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-sponsors">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <BadgeDollarSign1 />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Sponsors</p>
        </div>
      </div>
    </div>
  );
}

function HandHeart() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="hand-heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="hand-heart">
          <path d={svgPaths.p191c1b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemVolunteers() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-volunteers">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <HandHeart />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Volunteers</p>
        </div>
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="user">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="user">
          <path d={svgPaths.p61d9400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemSpeakers() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-speakers">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <User />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Speakers</p>
        </div>
      </div>
    </div>
  );
}

function MessageSquare() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="message-square">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="message-square">
          <path d={svgPaths.p1ff538f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemChat() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-chat">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <MessageSquare />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Chat</p>
        </div>
      </div>
    </div>
  );
}

function Folder() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="folder">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="folder">
          <path d={svgPaths.pf1fc000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemDocuments() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-documents">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Folder />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Documents</p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_1396)" id="check-circle">
          <path d={svgPaths.p2ce74680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1396">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemApprovals() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-approvals">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <CheckCircle />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Approvals</p>
        </div>
      </div>
    </div>
  );
}

function Items3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="items">
      <ItemInternalTeam />
      <ItemVendors />
      <ItemSponsors />
      <ItemVolunteers />
      <ItemSpeakers />
      <ItemChat />
      <ItemDocuments />
      <ItemApprovals />
    </div>
  );
}

function SectionCollaborate() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-collaborate">
      <SectionHeader3 />
      <Items3 />
    </div>
  );
}

function SectionHeader4() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="section-header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[24px] whitespace-nowrap">Insights</p>
        </div>
      </div>
    </div>
  );
}

function Users2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="users">
          <path d={svgPaths.p4264400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemAttendance() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-attendance">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Users2 />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Attendance</p>
        </div>
      </div>
    </div>
  );
}

function DollarSign() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="dollar-sign">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="dollar-sign">
          <path d={svgPaths.p28995a80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemRevenue() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-revenue">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <DollarSign />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Revenue</p>
        </div>
      </div>
    </div>
  );
}

function MessageCircle() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="message-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_1393)" id="message-circle">
          <path d={svgPaths.p16ccbb80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1393">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemFeedback() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-feedback">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <MessageCircle />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Feedback</p>
        </div>
      </div>
    </div>
  );
}

function TrendingUp() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="trending-up">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="trending-up">
          <path d={svgPaths.p39419680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemRoi() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-roi">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <TrendingUp />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">ROI</p>
        </div>
      </div>
    </div>
  );
}

function PieChart() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="pie-chart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_1387)" id="pie-chart">
          <path d={svgPaths.p3c2c66e0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1387">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemSponsorPerformance() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-sponsor-performance">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <PieChart />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Sponsor Performance</p>
        </div>
      </div>
    </div>
  );
}

function Wallet1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="wallet">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="wallet">
          <path d={svgPaths.p378b48c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemBudget1() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="item-budget">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <Wallet1 />
          <p className="[word-break:break-word] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.8)] whitespace-nowrap">Budget</p>
        </div>
      </div>
    </div>
  );
}

function Items4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="items">
      <ItemAttendance />
      <ItemRevenue />
      <ItemFeedback />
      <ItemRoi />
      <ItemSponsorPerformance />
      <ItemBudget1 />
    </div>
  );
}

function SectionInsights() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-insights">
      <SectionHeader4 />
      <Items4 />
    </div>
  );
}

function NavContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="nav-content">
      <div className="content-stretch flex flex-col items-start pb-[24px] pl-[48px] pr-[24px] relative size-full">
        <NavItemDashboard />
        <NavItemEvents />
        <SectionPlanning />
        <SectionFind />
        <SectionExecute />
        <SectionCollaborate />
        <SectionInsights />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col gap-[49px] items-start left-0 pt-[32px] top-0 w-[380px]" data-name="Sidebar">
      <Logo />
      <NavContent />
    </div>
  );
}

function Settings1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="settings">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="settings">
          <path d={svgPaths.p6e61700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Settings() {
  return (
    <div className="absolute bg-[rgba(26,26,26,0.8)] content-stretch flex flex-col items-center justify-center left-[1276px] rounded-[27px] size-[54px] top-[16px]" data-name="Settings">
      <Settings1 />
    </div>
  );
}

function User1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="user">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="user">
          <path d={svgPaths.p19d75080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute bg-[rgba(26,26,26,0.8)] content-stretch flex flex-col items-center justify-center left-[1362px] rounded-[27px] size-[54px] top-[16px]" data-name="Profile">
      <User1 />
    </div>
  );
}

function MenuHamburger() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="menu-hamburger">
      <div className="absolute bg-white h-[2px] left-[3px] rounded-[1px] top-[4px] w-[18px]" data-name="line-1" />
      <div className="absolute bg-white h-[2px] left-[3px] rounded-[1px] top-[11px] w-[18px]" data-name="line-2" />
      <div className="absolute bg-white h-[2px] left-[3px] rounded-[1px] top-[18px] w-[18px]" data-name="line-3" />
    </div>
  );
}

function Options() {
  return (
    <div className="absolute bg-[rgba(26,26,26,0.8)] content-stretch flex flex-col items-center justify-center left-[1439px] rounded-[27px] size-[54px] top-[16px]" data-name="Options">
      <MenuHamburger />
    </div>
  );
}

function NavDashboard() {
  return (
    <div className="absolute h-[85px] left-0 overflow-clip top-0 w-[1539px]" data-name="nav-dashboard">
      <Settings />
      <Profile />
      <Options />
    </div>
  );
}

function Dashboard1() {
  return <div className="absolute h-[995px] left-0 top-[85px] w-[1539px]" data-name="Dashboard" />;
}

function DashContent() {
  return (
    <div className="absolute bg-black h-[1080px] left-[381px] top-0 w-[1539px]" data-name="dash-content">
      <NavDashboard />
      <Dashboard1 />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#666] relative size-full" data-name="Dashboard">
      <Sidebar />
      <DashContent />
    </div>
  );
}