import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "brand" | "accent" | "warning";
  className?: string;
}) {
  const toneClass =
    tone === "brand"
      ? "bg-brand-100 text-brand-800"
      : tone === "accent"
        ? "bg-cyan-100 text-cyan-800"
        : tone === "warning"
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-700";

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", toneClass, className)}>
      {children}
    </span>
  );
}
