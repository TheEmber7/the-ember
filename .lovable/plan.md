
## Featurebase Integration Plan

### What we're adding
Three Featurebase widgets + a Help dropdown button in the header (visible on desktop AND mobile top bar, placed right before the language switcher).

### 1. SDK Loader (`src/components/FeaturebaseLoader.tsx`)
A single client-only component mounted once in `__root.tsx`. It:
- Injects the Featurebase SDK `<script>` once (id `featurebase-sdk`).
- Boots **Live Support Messenger** with `appId: "69e384b070da38b54b33a688"`, `theme: "dark"`, `language` synced from `useI18n()` (`en` / `hu`), and `hideDefaultLauncher: true` so the floating bubble doesn't clash with the minimalist design.
- Initializes **Changelog widget** with `organization: "zsombortheember"`, `theme: "dark"`, dropdown + popup enabled, `autoOpenForNewUpdates: true`, locale synced to current language. ChangelogCard disabled (we trigger it from the dropdown instead).
- Initializes **Feedback widget** with `organization: "zsombortheember"`, `theme: "dark"`, `placement` omitted (no floating button — triggered from dropdown).
- Re-runs language sync when `lang` changes via `Featurebase("update", { ... })` / `Featurebase("identify", ...)` patterns; if not supported we re-init.

### 2. Help Dropdown (`src/components/HelpMenu.tsx`)
- Trigger: circled question-mark button (`HelpCircle` from lucide-react) styled to match the existing language pill (small rounded border, hover golden glow).
- Uses existing `@/components/ui/dropdown-menu` (already in project) for accessible keyboard/focus handling and consistent styling.
- Two items, both translated via `t.help.*`:
  - **Give Feedback** → triggers `Featurebase("manually_open_feedback_widget")`.
  - **What's New** → triggers `Featurebase("manually_open_changelog_popup")`.
- Falls back gracefully if SDK not yet loaded (queues call, since the SDK shim already buffers via `Featurebase.q`).

### 3. Header changes (`src/components/SiteHeader.tsx`)
- Insert `<HelpMenu />` immediately before `<LanguageSwitcher />` in the right-side cluster.
- Make it visible on mobile too (no `hidden sm:inline-flex`), per request.
- Mobile menu panel: also include it next to the language switcher at the bottom for parity.

### 4. Translations (`src/i18n/translations.ts`)
Add a `help` namespace:
- EN: `{ label: "Help", feedback: "Give Feedback", changelog: "What's New" }`
- HU: `{ label: "Súgó", feedback: "Visszajelzés küldése", changelog: "Újdonságok" }`

### 5. Root mount (`src/routes/__root.tsx`)
Add `<FeaturebaseLoader />` inside the providers tree (after `LanguageProvider` so it can read current language).

### Technical notes
- All Featurebase calls are wrapped in `typeof window !== "undefined"` guards so SSR doesn't break.
- Theme hardcoded to `"dark"` to match the deep-blue palette.
- No new dependencies required — Featurebase SDK is loaded via injected `<script>` tag, dropdown uses existing Radix-based `dropdown-menu` UI primitive.
- No secrets needed — appId and org slug are public client-side identifiers.

### Files touched
- **Create**: `src/components/FeaturebaseLoader.tsx`, `src/components/HelpMenu.tsx`
- **Edit**: `src/components/SiteHeader.tsx`, `src/i18n/translations.ts`, `src/routes/__root.tsx`
