import type { ReactNode } from "react";

type AlertType = "info" | "warning" | "error" | "success";

const STYLES: Record<AlertType, string> = {
  info: "border-l-usa-blue bg-[#e1f3f8]",
  warning: "border-l-usa-gold bg-usa-gold-light",
  error: "border-l-usa-red bg-[#f9dede]",
  success: "border-l-usa-green bg-[#e7f4e4]",
};

export default function Alert({
  type = "info",
  title,
  children,
}: {
  type?: AlertType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border-l-[6px] p-4 ${STYLES[type]}`}>
      {title && <p className="mb-1 font-serif font-bold text-usa-darkest">{title}</p>}
      <div className="text-sm leading-relaxed text-usa-ink">{children}</div>
    </div>
  );
}
