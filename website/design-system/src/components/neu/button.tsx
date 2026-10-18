import type { ButtonHTMLAttributes } from "react";
import "../neu.css";

export function Button({
  variant = "primary", className = "", type = "button", ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "text" }) {
  return <button type={type} className={`${variant === "text" ? "wj-text-action" : `wj-${variant}`} ${className}`} {...props} />;
}
