import { useEffect } from "react";
import { useI18n } from "@/i18n/LanguageProvider";

const FB_APP_ID = "69e384b070da38b54b33a688";
const FB_ORG = "zsombortheember";

declare global {
  interface Window {
    Featurebase?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

function ensureSdk() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (typeof window.Featurebase !== "function") {
    const fb = function (...args: unknown[]) {
      (fb.q = fb.q || []).push(args);
    } as ((...args: unknown[]) => void) & { q?: unknown[] };
    window.Featurebase = fb;
  }
  if (!document.getElementById("featurebase-sdk")) {
    const s = document.createElement("script");
    s.id = "featurebase-sdk";
    s.src = "https://do.featurebase.app/js/sdk.js";
    document.getElementsByTagName("script")[0]?.parentNode?.insertBefore(
      s,
      document.getElementsByTagName("script")[0],
    );
  }
}

export function FeaturebaseLoader() {
  const { lang } = useI18n();

  useEffect(() => {
    ensureSdk();
    if (typeof window === "undefined" || !window.Featurebase) return;

    // Live Support Messenger — show the default floating launcher
    window.Featurebase("boot", {
      appId: FB_APP_ID,
      theme: "dark",
      language: lang,
    });

    // Feedback widget — initialize without floating button; opened manually from HelpMenu
    window.Featurebase("initialize_feedback_widget", {
      organization: FB_ORG,
      theme: "dark",
      locale: lang,
    });
  }, [lang]);

  return null;
}
