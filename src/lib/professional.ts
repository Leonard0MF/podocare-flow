import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/*
 * Dados da profissional (user_metadata do Supabase Auth),
 * usados na assinatura das mensagens de WhatsApp enviadas
 * às clientes.
 */
export type ProfessionalProfile = {
  name: string;
  clinicName: string;
  phone: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function profileFromUser(
  user: User | null,
): ProfessionalProfile {
  const metadata = user?.user_metadata ?? {};

  return {
    name: readString(metadata["name"]),
    clinicName: readString(metadata["clinic_name"]),
    phone: readString(metadata["phone"]),
  };
}

export function useProfessionalProfile() {
  const [profile, setProfile] = useState<ProfessionalProfile>(
    profileFromUser(null),
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setProfile(profileFromUser(data.user));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return profile;
}

/*
 * (11) 98765-4321 / (11) 3456-7890, aplicado enquanto digita.
 */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) {
    return `(${area}) ${rest}`;
  }

  const splitAt = rest.length === 9 ? 5 : 4;

  return `(${area}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}

export function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return digits.startsWith("55") ? digits : `55${digits}`;
}

/*
 * Linhas finais das mensagens: nome do consultório (ou da
 * profissional) e o telefone de contato.
 */
export function getMessageSignature(profile: ProfessionalProfile) {
  const signer = profile.clinicName || profile.name;
  const lines: string[] = [];

  if (signer) {
    lines.push(`— ${signer}`);
  }

  if (profile.phone) {
    lines.push(`Contato: ${formatPhone(profile.phone)}`);
  }

  return lines.length ? ["", ...lines] : [];
}

export function getWhatsAppUrl(phone: string, lines: string[]) {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}
