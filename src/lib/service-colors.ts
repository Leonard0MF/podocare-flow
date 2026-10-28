/*
 * Cores dos serviços. No banco fica só a chave
 * (coluna `services.color`); o hex é resolvido aqui.
 */
export const SERVICE_COLORS = [
  { key: "ciano", label: "Ciano", hex: "#0891b2" },
  { key: "azul", label: "Azul", hex: "#2563eb" },
  { key: "roxo", label: "Roxo", hex: "#7c3aed" },
  { key: "rosa", label: "Rosa", hex: "#db2777" },
  { key: "vermelho", label: "Vermelho", hex: "#dc2626" },
  { key: "laranja", label: "Laranja", hex: "#ea580c" },
  { key: "amarelo", label: "Amarelo", hex: "#ca8a04" },
  { key: "verde", label: "Verde", hex: "#16a34a" },
  { key: "cinza", label: "Cinza", hex: "#64748b" },
] as const;

export type ServiceColorKey =
  (typeof SERVICE_COLORS)[number]["key"];

export const DEFAULT_SERVICE_COLOR: ServiceColorKey = "ciano";

export function getServiceColor(key: string | null | undefined) {
  return (
    SERVICE_COLORS.find((color) => color.key === key) ??
    SERVICE_COLORS[0]
  );
}

/*
 * Hex + transparência (#rrggbbaa) para fundos e bordas.
 */
export function withAlpha(hex: string, alpha: number) {
  const value = Math.round(
    Math.min(1, Math.max(0, alpha)) * 255,
  )
    .toString(16)
    .padStart(2, "0");

  return `${hex}${value}`;
}
