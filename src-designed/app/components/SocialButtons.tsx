import svgPaths from "../../imports/Login/svg-08oe0c8gne";

interface SocialButtonsProps {
  onClick?: () => void;
}

function GoogleIcon() {
  return (
    <svg className="size-[22px]" fill="none" viewBox="0 0 23 23">
      <path clipRule="evenodd" d={svgPaths.p15d7be00} fill="#4285F4" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p1f2f62f0} fill="#34A853" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p2f8c9600} fill="#FBBC05" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p14f01400} fill="#EA4335" fillRule="evenodd" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-[22px] w-[19px]" fill="none" viewBox="0 0 19.3734 23">
      <path d={svgPaths.p27f3500} fill="black" />
    </svg>
  );
}

export function SocialButtons({ onClick }: SocialButtonsProps) {
  const btn =
    "flex w-full items-center justify-center gap-3 rounded-full border border-[#e0e0e9] bg-white px-6 py-[15px] font-['Inter:Medium',sans-serif] font-medium text-[#1d1c2b] text-[17px] transition-transform hover:scale-[1.01]";
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button type="button" onClick={onClick} className={btn}>
        <GoogleIcon />
        Sign up with Google
      </button>
      <button type="button" onClick={onClick} className={btn}>
        <AppleIcon />
        Sign up with Apple
      </button>
    </div>
  );
}
