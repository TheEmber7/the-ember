import { useEffect } from "react";
import { useI18n } from "@/i18n/LanguageProvider";

declare global {
  interface Window {
    Featurebase?: FeaturebaseCommand;
  }
}

type FeaturebaseCommand = ((command: string, options?: Record<string, unknown>) => void) & {
  q?: unknown[];
};

const FEATUREBASE_SCRIPT_ID = "featurebase-sdk";
const FEATUREBASE_APP_ID = "69e384b070da38b54b33a688";
const FEATUREBASE_ORGANIZATION = "theember";

function ensureFeaturebaseSdk() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (!window.Featurebase) {
    const queue: unknown[] = [];
    const featurebase = ((...args: unknown[]) => {
      queue.push(args);
    }) as FeaturebaseCommand;
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

    window.Featurebase?.("boot", {
      appId: FEATUREBASE_APP_ID,
      theme: "dark",
      language: lang,
      hideDefaultLauncher: false,
    });

    window.Featurebase?.("init_changelog_widget", {
      organization: FEATUREBASE_ORGANIZATION,
      changelogCard: {
        enabled: true,
        layout: {
          position: "bottom-left",
          marginBottom: 20,
          marginSide: 20,
          maxWidth: 400,
        },
        openInNewTab: false,
      },
      dropdown: {
        enabled: true,
        placement: "right",
      },
      popup: {
        enabled: true,
        usersName: "John",
        autoOpenForNewUpdates: true,
      },
      theme: "dark",
      locale: lang,
    });
  }, [lang]);

  return null;
}