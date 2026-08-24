import type { ReactNode } from "react";

export function PrimaryButton({
  children,
  onClick,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "soft";
}) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold min-h-14 transition-colors";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground shadow-float hover:bg-primary/90"
      : "bg-primary-soft text-primary hover:bg-primary-soft/70";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
