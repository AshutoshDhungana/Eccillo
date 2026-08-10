import svgPaths from "./svg-36xk0ze4qk";
import imgHeaderImageCreate from "./d0c8a19ddc8705480432066e1561acca030307ae.png";
import imgHeaderImageRooftop from "./f52a1f238ceddefad22fddd3127c3026aff27e60.png";
import imgHeaderImage from "./a8d9caceb9008905813da20bd52041f439198816.png";
import imgHeaderImage1 from "./3c9eba56d5b617fcc1e90e78489c54e70d145977.png";
import imgHeaderImage2 from "./dd94dc511247dea33fc76edfff818f7655ff9bf5.png";
import imgHeaderImage3 from "./cdc7cdc6a10cf54dc3a653efb47a190ae828e436.png";

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
            <path d={svgPaths.p2f7c3ff0} stroke="var(--stroke-0, #8E8D94)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p772e900} stroke="var(--stroke-0, #8E8D94)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p99ad200} stroke="var(--stroke-0, #8E8D94)" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p3fc0d440} stroke="var(--stroke-0, #8E8D94)" strokeLinecap="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function NavItemDashboard() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="Nav_Item_Dashboard">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <LayoutDashboard />
          <p className="[word-break:break-word] flex-[1_0_0] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[24px] text-white">Dashboard</p>
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
          <path d={svgPaths.p26d74000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function NavItemEvents() {
  return (
    <div className="bg-white relative rounded-[10.3px] shrink-0 w-full" data-name="Nav_Item_Events">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10.3px] items-center px-[12.36px] py-[8.24px] relative size-full">
          <CalendarCheck />
          <p className="[word-break:break-word] flex-[1_0_0] font-['Helvetica_Now_Display:Regular',sans-serif] leading-[normal] min-w-px not-italic relative text-[24px] text-black">Events</p>
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

function TitleArea() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Title_Area">
      <p className="font-['Instrument_Serif:Italic',sans-serif] italic relative shrink-0 text-[48px] text-white">Events</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#8e8d94] text-[14px]">Oversee and manage your active operations</p>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="search">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="search">
          <path d={svgPaths.p3f6e0f00} id="Vector" stroke="var(--stroke-0, #8E8D94)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex gap-[10px] items-center px-[20px] py-[12px] relative rounded-[200px] shrink-0 w-[340px]" data-name="Search_Input">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <Search />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#8e8d94] text-[14px]">Search events...</p>
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="plus">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="plus">
          <path d={svgPaths.p133cc000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function CreateEventCta() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative rounded-[200px] shrink-0" data-name="Create_Event_CTA">
      <Plus />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Create New Event</p>
    </div>
  );
}

function ControlsGroup() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Controls_Group">
      <SearchInput />
      <CreateEventCta />
    </div>
  );
}

function TopBar() {
  return (
    <div className="content-stretch flex gap-[570px] items-center relative shrink-0 w-[1485px]" data-name="Top_Bar">
      <TitleArea />
      <ControlsGroup />
    </div>
  );
}

function TabBadge() {
  return (
    <div className="bg-[rgba(0,0,0,0.08)] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[100px] shrink-0" data-name="Tab_Badge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">12</p>
    </div>
  );
}

function TabAllEvents() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[200px] shrink-0" data-name="Tab_All Events">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-black whitespace-nowrap">All Events</p>
      <TabBadge />
    </div>
  );
}

function TabBadge1() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[100px] shrink-0" data-name="Tab_Badge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#8e8d94] text-[11px] whitespace-nowrap">6</p>
    </div>
  );
}

function TabUpcoming() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[200px] shrink-0" data-name="Tab_Upcoming">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Upcoming</p>
      <TabBadge1 />
    </div>
  );
}

function TabBadge2() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[100px] shrink-0" data-name="Tab_Badge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#8e8d94] text-[11px] whitespace-nowrap">4</p>
    </div>
  );
}

function TabPast() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[200px] shrink-0" data-name="Tab_Past">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Past</p>
      <TabBadge2 />
    </div>
  );
}

function TabBadge3() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[100px] shrink-0" data-name="Tab_Badge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#8e8d94] text-[11px] whitespace-nowrap">2</p>
    </div>
  );
}

function TabDrafts() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[200px] shrink-0" data-name="Tab_Drafts">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Drafts</p>
      <TabBadge3 />
    </div>
  );
}

function FilterTabsRow() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Filter_Tabs_Row">
      <TabAllEvents />
      <TabUpcoming />
      <TabPast />
      <TabDrafts />
    </div>
  );
}

function CardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] pt-[28px] px-[32px] relative size-full">
        <p className="font-['Instrument_Serif:Italic',sans-serif] italic relative shrink-0 text-[32px] text-white w-full">Create New Event</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#8e8d94] text-[16px] w-full">Plan your next gathering</p>
      </div>
    </div>
  );
}

function CardTop() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image_Create">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImageCreate} />
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>
      </div>
      <CardBody />
    </div>
  );
}

function PrimaryButton() {
  return (
    <div className="bg-white content-stretch flex h-[56px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Primary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">Create Event</p>
    </div>
  );
}

function CardBottom() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <PrimaryButton />
      </div>
    </div>
  );
}

function CreateEventCard() {
  return (
    <div className="bg-[#1c1b1e] h-[500px] relative rounded-[24px] shrink-0 w-[465px]" data-name="Create_Event_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop />
        <CardBottom />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function DetailRowLoc() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Loc">
      <div className="relative shrink-0 size-[16px]" data-name="Loc_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p1c13ed00} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Loc_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">23 West Terrace, London</p>
    </div>
  );
}

function DetailRowDate() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Date">
      <div className="relative shrink-0 size-[16px]" data-name="Cal_Icon">
        <div className="absolute inset-[10%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.4">
            <path d={svgPaths.p2feaf840} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Cal_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Saturday, 14 June 2026</p>
    </div>
  );
}

function DetailRowTime() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Time">
      <div className="relative shrink-0 size-[16px]" data-name="Clock_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p30769300} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Clock_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">7:00 PM – 11:00 PM</p>
    </div>
  );
}

function DetailRowAttendees() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Attendees">
      <div className="relative shrink-0 size-[16px]" data-name="Users_Icon">
        <div className="absolute inset-[0_45%_55.56%_15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 7.11111">
            <path d={svgPaths.p114d1800} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Users_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">48 attending</p>
    </div>
  );
}

function DetailsList() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Details_List">
      <DetailRowLoc />
      <DetailRowDate />
      <DetailRowTime />
      <DetailRowAttendees />
    </div>
  );
}

function CardBody1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[32px] relative size-full">
        <p className="[word-break:break-word] font-['Instrument_Serif:Italic',sans-serif] italic leading-[normal] relative shrink-0 text-[28px] text-black w-full">Summer Rooftop Soirée</p>
        <DetailsList />
      </div>
    </div>
  );
}

function CardTop1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image_Rooftop">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImageRooftop} />
          <div className="absolute bg-[rgba(0,0,0,0.15)] inset-0" />
        </div>
      </div>
      <CardBody1 />
    </div>
  );
}

function SecondaryButton() {
  return (
    <div className="bg-[#f2f1f4] content-stretch flex h-[52px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Secondary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">View Details</p>
    </div>
  );
}

function CardBottom1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <SecondaryButton />
      </div>
    </div>
  );
}

function RooftopSoireeCard() {
  return (
    <div className="bg-white h-[500px] relative rounded-[24px] shrink-0 w-[465px]" data-name="Rooftop_Soiree_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop1 />
        <CardBottom1 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function DetailRowLoc1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Loc">
      <div className="relative shrink-0 size-[16px]" data-name="Loc_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p1c13ed00} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Loc_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Royal Exhibition Hall, London</p>
    </div>
  );
}

function DetailRowDate1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Date">
      <div className="relative shrink-0 size-[16px]" data-name="Cal_Icon">
        <div className="absolute inset-[10%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.4">
            <path d={svgPaths.p2feaf840} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Cal_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Thursday, 18 June 2026</p>
    </div>
  );
}

function DetailRowTime1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Time">
      <div className="relative shrink-0 size-[16px]" data-name="Clock_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p30769300} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Clock_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">9:00 AM – 5:00 PM</p>
    </div>
  );
}

function DetailRowAttendees1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Attendees">
      <div className="relative shrink-0 size-[16px]" data-name="Users_Icon">
        <div className="absolute inset-[0_45%_55.56%_15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 7.11111">
            <path d={svgPaths.p114d1800} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Users_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">350 attending</p>
    </div>
  );
}

function DetailsList1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Details_List">
      <DetailRowLoc1 />
      <DetailRowDate1 />
      <DetailRowTime1 />
      <DetailRowAttendees1 />
    </div>
  );
}

function CardBody2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[32px] relative size-full">
        <p className="[word-break:break-word] font-['Instrument_Serif:Italic',sans-serif] italic leading-[normal] relative shrink-0 text-[28px] text-black w-full">Tech Innovation Summit</p>
        <DetailsList1 />
      </div>
    </div>
  );
}

function CardTop2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImage} />
          <div className="absolute bg-[rgba(0,0,0,0.1)] inset-0" />
        </div>
      </div>
      <CardBody2 />
    </div>
  );
}

function SecondaryButton1() {
  return (
    <div className="bg-[#f2f1f4] content-stretch flex h-[52px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Secondary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">View Details</p>
    </div>
  );
}

function CardBottom2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <SecondaryButton1 />
      </div>
    </div>
  );
}

function TechSummitCard() {
  return (
    <div className="bg-white h-[500px] relative rounded-[24px] shrink-0 w-[465px]" data-name="Tech_Summit_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop2 />
        <CardBottom2 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function GridRow() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Grid_Row_1">
      <CreateEventCard />
      <RooftopSoireeCard />
      <TechSummitCard />
    </div>
  );
}

function DetailRowLoc2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Loc">
      <div className="relative shrink-0 size-[16px]" data-name="Loc_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p1c13ed00} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Loc_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">The Savoy, Grand Ballroom</p>
    </div>
  );
}

function DetailRowDate2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Date">
      <div className="relative shrink-0 size-[16px]" data-name="Cal_Icon">
        <div className="absolute inset-[10%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.4">
            <path d={svgPaths.p2feaf840} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Cal_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Friday, 20 June 2026</p>
    </div>
  );
}

function DetailRowTime2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Time">
      <div className="relative shrink-0 size-[16px]" data-name="Clock_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p30769300} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Clock_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">6:30 PM – 11:30 PM</p>
    </div>
  );
}

function DetailRowAttendees2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Attendees">
      <div className="relative shrink-0 size-[16px]" data-name="Users_Icon">
        <div className="absolute inset-[0_45%_55.56%_15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 7.11111">
            <path d={svgPaths.p114d1800} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Users_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">180 attending</p>
    </div>
  );
}

function DetailsList2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Details_List">
      <DetailRowLoc2 />
      <DetailRowDate2 />
      <DetailRowTime2 />
      <DetailRowAttendees2 />
    </div>
  );
}

function CardBody3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[32px] relative size-full">
        <p className="[word-break:break-word] font-['Instrument_Serif:Italic',sans-serif] italic leading-[normal] relative shrink-0 text-[28px] text-black w-full">Annual Gala Dinner</p>
        <DetailsList2 />
      </div>
    </div>
  );
}

function CardTop3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImage1} />
          <div className="absolute bg-[rgba(0,0,0,0.1)] inset-0" />
        </div>
      </div>
      <CardBody3 />
    </div>
  );
}

function SecondaryButton2() {
  return (
    <div className="bg-[#f2f1f4] content-stretch flex h-[52px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Secondary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">View Details</p>
    </div>
  );
}

function CardBottom3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <SecondaryButton2 />
      </div>
    </div>
  );
}

function GalaDinnerCard() {
  return (
    <div className="bg-white h-[520px] relative rounded-[24px] shrink-0 w-[466px]" data-name="Gala_Dinner_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop3 />
        <CardBottom3 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function DetailRowLoc3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Loc">
      <div className="relative shrink-0 size-[16px]" data-name="Loc_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p1c13ed00} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Loc_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Silicone Docks Terrace, Dublin</p>
    </div>
  );
}

function DetailRowDate3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Date">
      <div className="relative shrink-0 size-[16px]" data-name="Cal_Icon">
        <div className="absolute inset-[10%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.4">
            <path d={svgPaths.p2feaf840} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Cal_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Tuesday, 23 June 2026</p>
    </div>
  );
}

function DetailRowTime3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Time">
      <div className="relative shrink-0 size-[16px]" data-name="Clock_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p30769300} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Clock_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">7:00 PM – 10:00 PM</p>
    </div>
  );
}

function DetailRowAttendees3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Attendees">
      <div className="relative shrink-0 size-[16px]" data-name="Users_Icon">
        <div className="absolute inset-[0_45%_55.56%_15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 7.11111">
            <path d={svgPaths.p114d1800} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Users_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">95 attending</p>
    </div>
  );
}

function DetailsList3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Details_List">
      <DetailRowLoc3 />
      <DetailRowDate3 />
      <DetailRowTime3 />
      <DetailRowAttendees3 />
    </div>
  );
}

function CardBody4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[32px] relative size-full">
        <p className="[word-break:break-word] font-['Instrument_Serif:Italic',sans-serif] italic leading-[normal] relative shrink-0 text-[28px] text-black w-full">Product Launch Party</p>
        <DetailsList3 />
      </div>
    </div>
  );
}

function CardTop4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImage2} />
          <div className="absolute bg-[rgba(0,0,0,0.15)] inset-0" />
        </div>
      </div>
      <CardBody4 />
    </div>
  );
}

function SecondaryButton3() {
  return (
    <div className="bg-[#f2f1f4] content-stretch flex h-[52px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Secondary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">View Details</p>
    </div>
  );
}

function CardBottom4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <SecondaryButton3 />
      </div>
    </div>
  );
}

function ProductLaunchCard() {
  return (
    <div className="bg-white h-[520px] relative rounded-[24px] shrink-0 w-[465px]" data-name="Product_Launch_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop4 />
        <CardBottom4 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function DetailRowLoc4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Loc">
      <div className="relative shrink-0 size-[16px]" data-name="Loc_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p1c13ed00} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Loc_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">Aman Resorts, Swiss Alps</p>
    </div>
  );
}

function DetailRowDate4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Date">
      <div className="relative shrink-0 size-[16px]" data-name="Cal_Icon">
        <div className="absolute inset-[10%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.4">
            <path d={svgPaths.p2feaf840} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Cal_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">14 – 17 July 2026</p>
    </div>
  );
}

function DetailRowTime4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Time">
      <div className="relative shrink-0 size-[16px]" data-name="Clock_Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p30769300} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Clock_Icon" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">All Day Event</p>
    </div>
  );
}

function DetailRowAttendees4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Detail_Row_Attendees">
      <div className="relative shrink-0 size-[16px]" data-name="Users_Icon">
        <div className="absolute inset-[0_45%_55.56%_15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 7.11111">
            <path d={svgPaths.p114d1800} fill="var(--fill-0, black)" fillOpacity="0.639216" id="Users_Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic overflow-hidden relative text-[14px] text-[rgba(0,0,0,0.64)] text-ellipsis whitespace-nowrap">42 attending</p>
    </div>
  );
}

function DetailsList4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Details_List">
      <DetailRowLoc4 />
      <DetailRowDate4 />
      <DetailRowTime4 />
      <DetailRowAttendees4 />
    </div>
  );
}

function CardBody5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Body">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[32px] relative size-full">
        <p className="[word-break:break-word] font-['Instrument_Serif:Italic',sans-serif] italic leading-[normal] relative shrink-0 text-[28px] text-black w-full">Corporate Retreat</p>
        <DetailsList4 />
      </div>
    </div>
  );
}

function CardTop5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Card_Top">
      <div className="h-[220px] relative shrink-0 w-full" data-name="Header_Image">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgHeaderImage3} />
          <div className="absolute bg-[rgba(0,0,0,0.1)] inset-0" />
        </div>
      </div>
      <CardBody5 />
    </div>
  );
}

function SecondaryButton4() {
  return (
    <div className="bg-[#f2f1f4] content-stretch flex h-[52px] items-center justify-center relative rounded-[114px] shrink-0 w-full" data-name="Secondary_Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">View Details</p>
    </div>
  );
}

function CardBottom5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card_Bottom">
      <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
        <SecondaryButton4 />
      </div>
    </div>
  );
}

function CorporateRetreatCard() {
  return (
    <div className="bg-white h-[520px] relative rounded-[24px] shrink-0 w-[466px]" data-name="Corporate_Retreat_Card">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip relative rounded-[inherit] size-full">
        <CardTop5 />
        <CardBottom5 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function GridRow1() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Grid_Row_2">
      <GalaDinnerCard />
      <ProductLaunchCard />
      <CorporateRetreatCard />
    </div>
  );
}

function EventsGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Events_Grid">
      <GridRow />
      <GridRow1 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[1336px] items-start left-0 pb-[48px] pt-[40px] px-[48px] top-[85px] w-[1539px]" data-name="Main_Content">
      <TopBar />
      <FilterTabsRow />
      <EventsGrid />
    </div>
  );
}

function DashContent() {
  return (
    <div className="absolute bg-black h-[1080px] left-[381px] top-0 w-[1539px]" data-name="dash-content">
      <NavDashboard />
      <MainContent />
    </div>
  );
}

export default function Events() {
  return (
    <div className="bg-[#666] relative size-full" data-name="Events">
      <Sidebar />
      <DashContent />
    </div>
  );
}