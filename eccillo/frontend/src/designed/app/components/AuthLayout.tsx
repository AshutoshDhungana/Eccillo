import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

/** Split-screen auth shell: form card on the left, brand hero on the right. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="designed-public-screen flex min-h-screen w-full flex-col bg-black lg:flex-row">
      {/* Form panel */}
      <div className="flex w-full items-center justify-center p-4 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-[520px] rounded-[20px] border border-white/10 bg-[rgba(26,26,26,0.8)] p-6 sm:p-10 lg:p-12">
          {children}
        </div>
      </div>

      {/* Brand hero */}
      <div className="flex w-full items-center justify-center px-8 pb-12 lg:w-1/2 lg:justify-start lg:px-16 lg:pb-0">
        <div className="max-w-[600px] text-white">
          <h1 className="font-['Georgia_Pro:Light',serif] text-[clamp(40px,6vw,84px)] leading-[1.1]">
            <span className="block">Every Event.</span>
            <span className="block">Every Connection.</span>
            <span className="block font-['Georgia_Pro:Light_Italic',serif] italic">
              All in one place.
            </span>
          </h1>
          <p className="mt-6 max-w-[481px] font-['Helvetica_Now_Display:Light',sans-serif] text-[clamp(16px,2vw,24px)] leading-normal text-white/90">
            Plan, organize, promote, and grow your events seamlessly - from start
            to unforgettable
          </p>
        </div>
      </div>
    </div>
  );
}
