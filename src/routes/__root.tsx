import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { FeaturebaseLoader } from "@/components/FeaturebaseLoader";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageProvider, useI18n } from "@/i18n/LanguageProvider";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <LanguageProvider>
      <NotFoundInner />
    </LanguageProvider>
  );
}

function NotFoundInner() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-ember ember-glow-text">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">{t.notFound.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.notFound.body}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring"
          >
            {t.notFound.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Ember" },
      {
        name: "description",
        content: "The Ember. AI Automation, community management.",
      },
      { name: "author", content: "Horváth Zsombor" },
      { property: "og:title", content: "The Ember" },
      {
        property: "og:description",
        content: "AI Automation and community management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Ember" },
      { name: "description", content: "The Ember's Forge" },
      { property: "og:description", content: "The Ember's Forge" },
      { name: "twitter:description", content: "The Ember's Forge" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca3761cb-9d23-479f-921e-5373fca36362/id-preview-6fbd7cca--06347ed2-72fe-4153-8618-7dff254792bf.lovable.app-1778337101726.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca3761cb-9d23-479f-921e-5373fca36362/id-preview-6fbd7cca--06347ed2-72fe-4153-8618-7dff254792bf.lovable.app-1778337101726.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LanguageProvider>
      <FeaturebaseLoader />
      <div className="fixed inset-0 -z-20 bg-background" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-[0.18] mix-blend-screen"
          src="/topographic-motion.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-background/72" />
      </div>
      <div className="relative flex min-h-screen flex-col bg-transparent text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </LanguageProvider>
  );
}
