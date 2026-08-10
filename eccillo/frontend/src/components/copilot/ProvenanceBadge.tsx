/** Marks whether a plan record came from the AI or a human. */
export function ProvenanceBadge({ source }: { source?: string }) {
  const ai = source === "ai";
  return (
    <span
      title={ai ? "Proposed by the AI" : "Added by a person"}
      className={"rounded-full px-1.5 py-0.5 text-[10px] leading-none " + (ai ? "bg-white/10 text-white/55" : "bg-white/[0.04] text-white/35")}
    >
      {ai ? "AI" : "You"}
    </span>
  );
}
