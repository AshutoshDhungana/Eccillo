import svgPaths from "../../imports/Login/svg-08oe0c8gne";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  markSize?: number;
  textClassName?: string;
}

/** Eccillo brand mark + wordmark. Reuses the imported logo SVG paths. */
export function Logo({
  showWordmark = true,
  className = "",
  markSize = 32,
  textClassName = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0"
        style={{ width: (markSize * 42.196) / 40, height: markSize }}
      >
        <svg
          className="absolute inset-0 block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 42.1964 40"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p3fbb0c00}
            fill="currentColor"
            fillRule="evenodd"
          />
          <path d={svgPaths.p11d3d800} fill="currentColor" />
        </svg>
      </div>
      {showWordmark && (
        <span
          className={`font-['Helvetica_Now_Display:Medium',sans-serif] leading-none ${textClassName}`}
          style={{ fontSize: markSize }}
        >
          Eccillo
        </span>
      )}
    </div>
  );
}
