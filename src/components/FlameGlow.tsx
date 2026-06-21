interface FlameGlowProps {
  className?: string;
  variant?: "default" | "reverse";
}

export default function FlameGlow({
  className = "",
  variant = "default",
}: FlameGlowProps) {
  const reverse = variant === "reverse";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <div
        className={`absolute w-[26rem] h-[26rem] rounded-full blur-3xl bg-flame-gold/35 ${
          reverse ? "-bottom-32 -right-24" : "-top-24 -right-24"
        }`}
      />
      <div
        className={`absolute w-[30rem] h-[30rem] rounded-full blur-3xl bg-flame-crimson/30 ${
          reverse ? "-top-32 -left-24" : "-bottom-32 -left-24"
        }`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full blur-3xl bg-flame-scarlet/15" />
    </div>
  );
}
