import { Check } from "lucide-react";
import {
  SERVICE_COLORS,
  type ServiceColorKey,
} from "@/lib/service-colors";

export function ServiceColorPicker({
  value,
  onChange,
  disabled,
}: {
  value: ServiceColorKey;
  onChange: (value: ServiceColorKey) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Cor do serviço"
      className="grid grid-cols-5 gap-3 sm:grid-cols-9"
    >
      {SERVICE_COLORS.map((color) => {
        const selected = color.key === value;

        return (
          <button
            key={color.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.label}
            title={color.label}
            disabled={disabled}
            onClick={() => onChange(color.key)}
            className={`mx-auto grid size-11 place-items-center rounded-full text-white transition-transform active:scale-90 disabled:opacity-60 ${
              selected
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                : ""
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {selected && <Check className="size-5" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
