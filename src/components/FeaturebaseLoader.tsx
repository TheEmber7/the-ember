import { useEffect } from "react";
import { useI18n } from "@/i18n/LanguageProvider";

declare global {
  interface Window {
    Featurebase?: ((command: string, options?: Record<string, unknown>) => void) & {
      q?: unknown[];
    };
  }
}

const FEATUREBASE_SCRIPT_ID = "featurebase-sdk";
const FEATUREBASE_APP_ID = "69e384b070da38b54b33a688";

function ensureFeaturebaseSdk() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (!window.Featurebase) {
    const queue: unknown[] = [];
    const featurebase = ((...args: unknown[]) => {
      queue.push(args);
    }) as Window["Featurebase"];
    featurebase.q = queue;
    window.Featurebase = featurebase;
  }

  if (document.getElementById(FEATUREBASE_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = FEATUREBASE_SCRIPT_ID;
  script.src = "https://do.featurebase.app/js/sdk.js";
  script.async = true;
  document.head.appendChild(script);
}

export function FeaturebaseLoader() {
  const { lang } = useI18n();

  useEffect(() => {
    ensureFeaturebaseSdk();

    window.Featurebase?.("initialize_messenger", {
      appId: FEATUREBASE_APP_ID,
      theme: "dark",
      language: lang,
      hideDefaultLauncher: false,
    });
  }, [lang]);

  return null;
}