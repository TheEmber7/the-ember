import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageProvider } from "@/i18n/LanguageProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-ember ember-glow-text">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This path doesn't burn here. Let's get you back.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring"
          >
            Go home
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
      { title: "Horváth Zsombor — The Ember" },
      {
        name: "description",
        content:
          "Horváth Zsombor — The Ember. AI Automation, community management, and mental frameworks for sales and self-improvement.",
      },
      { name: "author", content: "Horváth Zsombor" },
      { property: "og:title", content: "Horváth Zsombor — The Ember" },
      {
        property: "og:description",
        content:
          "AI Automation, community management, and mental frameworks for sales and self-improvement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Horváth Zsombor — The Ember" },
      { name: "description", content: "The Ember's Forge is a personal website showcasing expertise in AI automation, community management, sales, and self-improvement." },
      { property: "og:description", content: "The Ember's Forge is a personal website showcasing expertise in AI automation, community management, sales, and self-improvement." },
      { name: "twitter:description", content: "The Ember's Forge is a personal website showcasing expertise in AI automation, community management, sales, and self-improvement." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3342bf28-a2fd-47a3-90b6-9a75d4577680/id-preview-62ce421f--06347ed2-72fe-4153-8618-7dff254792bf.lovable.app-1776519918874.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3342bf28-a2fd-47a3-90b6-9a75d4577680/id-preview-62ce421f--06347ed2-72fe-4153-8618-7dff254792bf.lovable.app-1776519918874.png" },
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
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </LanguageProvider>
  );
}
