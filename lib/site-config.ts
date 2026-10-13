/**
 * Single source of truth for business facts used by the landing page.
 *
 * Values left as `null` are intentionally unset: the UI hides dependent
 * links/buttons instead of rendering dummy numbers, empty hrefs, or fake
 * domains (DESIGN.md §9.4, §12). Fill them only with approved, real data.
 */

export type FeatureStatus =
  /** Verified as usable in the environment being offered. */
  | "available"
  /** Exists in the prototype; availability for the pilot still has to be confirmed. */
  | "prototype"
  /** Shown with a "Dalam pengembangan" label. */
  | "in-development"
  /** Not rendered. */
  | "hidden";

export type FeatureKey = "chat" | "photo" | "voice" | "activityLog";

type PhotoCredit = {
  file: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  /** Changes made for this site (required by CC licenses). */
  changes: string;
};

type SiteConfig = {
  name: string;
  /** Production origin, e.g. "https://example.id". Unset until the domain is decided. */
  productionUrl: string | null;
  contact: {
    /** Approved WhatsApp business number in international format, digits only (e.g. "62812..."). */
    whatsappNumber: string | null;
    /** Pre-filled message for the pilot contact link. */
    whatsappPilotMessage: string;
    email: string | null;
  };
  pilot: {
    /** Whether the team is actively accepting pilot requests. */
    acceptingRequests: boolean;
  };
  features: Record<FeatureKey, FeatureStatus>;
  legal: {
    privacyPolicyUrl: string | null;
    termsUrl: string | null;
  };
  /** Publishable developer/team identity. Unset until approved. */
  developer: {
    name: string;
    description: string;
  } | null;
  attribution: {
    icons8: { required: boolean; label: string; href: string };
    photos: PhotoCredit[];
  };
  copyrightYear: number;
};

export const siteConfig: SiteConfig = {
  name: "AgriSense",
  productionUrl: null,
  contact: {
    whatsappNumber: null,
    whatsappPilotMessage:
      "Halo AgriSense, saya mengelola greenhouse melon bermedia tanah dan ingin mendiskusikan pilot.",
    email: null,
  },
  pilot: {
    acceptingRequests: false,
  },
  features: {
    chat: "prototype",
    photo: "prototype",
    voice: "prototype",
    activityLog: "prototype",
  },
  legal: {
    privacyPolicyUrl: null,
    termsUrl: null,
  },
  developer: null,
  attribution: {
    icons8: {
      required: true,
      label: "Ikon oleh Icons8",
      href: "https://icons8.com",
    },
    photos: [
      {
        file: "/images/greenhouse-melon-harvest.jpg",
        title: "A man showing melons grown in their green house farm",
        author: "Emmanuel Ssekaggo",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:A_man_showing_melons_grown_in_their_green_house_farm.jpg",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        changes: "diperkecil dan dipotong",
      },
      {
        file: "/images/greenhouse-melon-tumpakkepuh-interior.jpg",
        title: "Greenhouse Melon Desa Tumpakkepuh",
        author: "Pancoffee",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Greenhouse_Melon_Desa_Tumpakkepuh.jpg",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        changes: "dipotong",
      },
      {
        file: "/images/greenhouse-melon-tumpakkepuh-exterior.jpg",
        title: "Greenhouse Melon di Desa Tumpakkepuh",
        author: "Ayamayam123",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Greenhouse_Melon_di_Desa_Tumpakkepuh.jpg",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        changes: "dipotong",
      },
    ],
  },
  copyrightYear: 2026,
};

/** Builds a wa.me link only when an approved number exists. */
export function getPilotWhatsAppUrl(): string | null {
  const digits = siteConfig.contact.whatsappNumber?.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(siteConfig.contact.whatsappPilotMessage)}`;
}

/** Pilot contact is public only when requests are accepted AND a real channel exists. */
export function getPilotContact(): { href: string; label: string } | null {
  if (!siteConfig.pilot.acceptingRequests) return null;
  const wa = getPilotWhatsAppUrl();
  if (wa) return { href: wa, label: "Diskusikan pilot via WhatsApp" };
  if (siteConfig.contact.email) {
    return { href: `mailto:${siteConfig.contact.email}`, label: "Diskusikan pilot via email" };
  }
  return null;
}

export function isFeatureVisible(key: FeatureKey): boolean {
  return siteConfig.features[key] !== "hidden";
}

/**
 * Public label for a capability card. Anything not yet verified in the pilot
 * environment says so plainly instead of implying it is ready (DESIGN.md §5.5,
 * §12).
 */
export function getFeatureStatus(key: FeatureKey): {
  label: string;
  /** Only verified features get the accent mark. */
  verified: boolean;
} {
  switch (siteConfig.features[key]) {
    case "available":
      return { label: "Tersedia untuk pilot", verified: true };
    case "in-development":
      return { label: "Dalam pengembangan", verified: false };
    case "prototype":
    default:
      return { label: "Tahap prototipe", verified: false };
  }
}
