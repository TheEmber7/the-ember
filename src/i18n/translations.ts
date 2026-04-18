export type Lang = "en" | "hu";

export const translations = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", contact: "Contact" },
    footer: {
      rights: "All rights reserved.",
      tagline: "Built with intent. Lit with purpose.",
    },
    notFound: {
      title: "Page not found",
      body: "This path doesn't burn here. Let's get you back.",
      cta: "Go home",
    },
    home: {
      eyebrow: "Online, I go by",
      title: "The",
      titleAccent: "Ember",
      intro: "I am",
      introAfter: "— building AI systems, leading communities, and sharpening minds.",
      highlights: ["AI Automation", "Community Management", "Sales & Mental Frameworks"],
      ctaPrimary: "What I Offer",
      ctaSecondary: "Get in Touch",
      scroll: "Scroll",
      quote: '"A small ember, given the right air, can light an entire forest.',
      quoteAccent: "That\u2019s the work.\"",
      moreAbout: "More about me",
    },
    about: {
      eyebrow: "About",
      title: "The man behind the",
      titleAccent: "Ember",
      intro:
        "I'm Horváth Zsombor. I work at the intersection of AI systems, community leadership, and the inner game that decides whether any of it actually works. My job is to help builders, operators, and communities become harder to stop.",
      pillarsTitle: "The Pillars",
      pillars: [
        { title: "Discipline", body: "Daily reps over moods. Standards over excuses." },
        { title: "Social Skill", body: "Listening loudly, speaking clearly, building trust on purpose." },
        { title: "Business Craft", body: "Selling honestly, solving real problems, compounding results." },
      ],
      mentorsEyebrow: "Mentors",
      mentorsTitle: "Standing on giants",
      mentors: [
        {
          role: "Business Mentor",
          name: "Prof. Arno Wingen",
          body: "Sales, communication, and the boring fundamentals that actually move the needle.",
        },
        {
          role: "Self-Improvement Mentor",
          name: "Lucky Luc",
          body: "Mental frameworks for resilience, focus, and showing up as the man the work requires.",
        },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "What I",
      titleAccent: "offer",
      intro: "Three lanes. One philosophy: build hard, lead clean, sharpen daily.",
      tags: { build: "Build", lead: "Lead", sharpen: "Sharpen" },
      items: [
        {
          title: "AI Automation",
          body:
            "Websites, chatbots, and end-to-end AI workflows. Prompt engineering that actually ships — not demos. I design systems that quietly do the boring work so you can focus on the leverage.",
          bullets: [
            "AI-powered websites & landing pages",
            "Custom chatbots & assistants",
            "Prompt engineering & workflow design",
          ],
        },
        {
          title: "Community Management",
          body:
            "General Manager for online communities. Operations, moderation, events, and the creative work that keeps a community alive — not just open. I run the room so the founder can build.",
          bullets: [
            "Day-to-day GM operations",
            "Creative content & engagement",
            "Onboarding & retention systems",
          ],
        },
        {
          title: "Sales & Mental Frameworks",
          body:
            "Coaching for the inner game of business. Social skills, sales fundamentals, and the mental frameworks that hold under pressure. Built on the work of Prof. Arno Wingen and Lucky Luc.",
          bullets: [
            "Sales fundamentals & objection handling",
            "Social skill & conversational craft",
            "Mental frameworks for resilience",
          ],
        },
      ],
      workWithMe: "Work with me",
      ctaTitle: "Not sure which lane fits?",
      ctaBody: "Tell me what you're building. I'll tell you straight if I can help.",
      ctaButton: "Start a conversation",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's",
      titleAccent: "talk",
      intro: "Tell me what you're building or working through. I read every message.",
      fields: { name: "Your name", email: "Email", topic: "Topic", message: "Message" },
      placeholders: {
        name: "Horváth Zsombor",
        email: "you@domain.com",
        message:
          "Tell me what you're building, where you're stuck, or what you want to sharpen…",
      },
      topics: [
        "AI Automation",
        "Community Management",
        "Sales & Mental Frameworks",
        "Something else",
      ],
      send: "Send message",
      sending: "Sending…",
      sent: "Message sent",
      sentNote: "Thanks — I'll be in touch shortly. (Email delivery wires up in the next build step.)",
      emailHint: "Prefer email? Mention it in the message and I'll reply directly.",
      featurebase: {
        eyebrow: "Featurebase",
        title: "Feedback & Roadmap",
        body: "Drop your Featurebase widget or embed snippet here. This slot is ready for it.",
        placeholder: "Featurebase widget will render here.",
      },
      errors: {
        nameRequired: "Name is required",
        tooLong: "Too long",
        emailInvalid: "Invalid email",
        topicRequired: "Pick a topic",
        messageMin: "Tell me a bit more (min 10 chars)",
        messageMax: "Keep it under 1500 chars",
      },
    },
  },
  hu: {
    nav: { home: "Főoldal", about: "Rólam", services: "Szolgáltatások", contact: "Kapcsolat" },
    footer: {
      rights: "Minden jog fenntartva.",
      tagline: "Szándékkal építve. Céllal lángra lobbantva.",
    },
    notFound: {
      title: "Az oldal nem található",
      body: "Ez az út itt nem ég. Vigyünk vissza.",
      cta: "Vissza a főoldalra",
    },
    home: {
      eyebrow: "Online így ismernek",
      title: "The",
      titleAccent: "Ember",
      intro: "Horváth Zsombor vagyok",
      introAfter: " — AI-rendszereket építek, közösségeket vezetek, és elméket élesítek.",
      highlights: ["AI Automatizáció", "Közösségmenedzsment", "Értékesítés és Mentális Keretrendszerek"],
      ctaPrimary: "Amit kínálok",
      ctaSecondary: "Vedd fel a kapcsolatot",
      scroll: "Görgess",
      quote: "„Egy kis parázs, megfelelő levegővel, egész erdőt lángba boríthat.",
      quoteAccent: "Ez a munka.\u201d",
      moreAbout: "Tudj meg többet rólam",
    },
    about: {
      eyebrow: "Rólam",
      title: "Az ember a",
      titleAccent: "parázs mögött",
      intro:
        "Horváth Zsombor vagyok. AI-rendszerek, közösségvezetés és a belső játék metszéspontján dolgozom — azon, ami eldönti, működik-e mindez a valóságban. A feladatom, hogy építőket, vezetőket és közösségeket nehezebben megállíthatóvá tegyek.",
      pillarsTitle: "A Pillérek",
      pillars: [
        { title: "Fegyelem", body: "Napi ismétlések a hangulatok helyett. Mércék a kifogások helyett." },
        { title: "Szociális Készség", body: "Hangosan figyelni, tisztán beszélni, tudatosan bizalmat építeni." },
        { title: "Üzleti Mesterség", body: "Őszintén értékesíteni, valódi problémákat megoldani, eredményeket kamatoztatni." },
      ],
      mentorsEyebrow: "Mentorok",
      mentorsTitle: "Óriások vállán",
      mentors: [
        {
          role: "Üzleti Mentor",
          name: "Prof. Arno Wingen",
          body: "Értékesítés, kommunikáció és az unalmas alapok, amik valóban előre mozdítanak.",
        },
        {
          role: "Önfejlesztési Mentor",
          name: "Lucky Luc",
          body: "Mentális keretrendszerek a kitartáshoz, fókuszhoz, és ahhoz, hogy azzá válj, akit a munka megkövetel.",
        },
      ],
    },
    services: {
      eyebrow: "Szolgáltatások",
      title: "Amit",
      titleAccent: "kínálok",
      intro: "Három sáv. Egy filozófia: építs keményen, vezess tisztán, élesíts naponta.",
      tags: { build: "Építés", lead: "Vezetés", sharpen: "Élesítés" },
      items: [
        {
          title: "AI Automatizáció",
          body:
            "Weboldalak, chatbotok és teljes körű AI munkafolyamatok. Prompt-mérnökség, ami valóban szállít — nem csak demók. Olyan rendszereket tervezek, amik csendben elvégzik az unalmas munkát, hogy te a tőkeáttételre fókuszálhass.",
          bullets: [
            "AI-alapú weboldalak és landing oldalak",
            "Egyedi chatbotok és asszisztensek",
            "Prompt-mérnökség és munkafolyamat-tervezés",
          ],
        },
        {
          title: "Közösségmenedzsment",
          body:
            "Online közösségek vezérigazgatója. Üzemeltetés, moderáció, események és kreatív munka, ami életben tartja a közösséget — nem csak nyitva. Én vezetem a termet, hogy az alapító építhessen.",
          bullets: [
            "Napi GM-üzemeltetés",
            "Kreatív tartalom és aktivitás",
            "Onboarding és megtartási rendszerek",
          ],
        },
        {
          title: "Értékesítés és Mentális Keretrendszerek",
          body:
            "Coaching az üzlet belső játékához. Szociális készségek, értékesítési alapok és mentális keretrendszerek, amik nyomás alatt is megtartanak. Prof. Arno Wingen és Lucky Luc munkájára építve.",
          bullets: [
            "Értékesítési alapok és kifogáskezelés",
            "Szociális készség és beszélgetési mesterség",
            "Mentális keretrendszerek a kitartáshoz",
          ],
        },
      ],
      workWithMe: "Dolgozzunk együtt",
      ctaTitle: "Nem vagy biztos, melyik sáv illik hozzád?",
      ctaBody: "Mondd el, mit építesz. Egyenesen megmondom, tudok-e segíteni.",
      ctaButton: "Indíts egy beszélgetést",
    },
    contact: {
      eyebrow: "Kapcsolat",
      title: "Beszéljünk",
      titleAccent: "együtt",
      intro: "Mondd el, mit építesz vagy min dolgozol. Minden üzenetet elolvasok.",
      fields: { name: "Neved", email: "E-mail", topic: "Téma", message: "Üzenet" },
      placeholders: {
        name: "Horváth Zsombor",
        email: "te@domain.hu",
        message:
          "Mondd el, mit építesz, hol akadtál el, vagy mit szeretnél élesíteni…",
      },
      topics: [
        "AI Automatizáció",
        "Közösségmenedzsment",
        "Értékesítés és Mentális Keretrendszerek",
        "Valami más",
      ],
      send: "Üzenet küldése",
      sending: "Küldés…",
      sent: "Üzenet elküldve",
      sentNote: "Köszönöm — hamarosan jelentkezem. (Az e-mail kézbesítés a következő lépésben kerül bekötésre.)",
      emailHint: "Inkább e-mail? Említsd meg az üzenetben, és közvetlenül válaszolok.",
      featurebase: {
        eyebrow: "Featurebase",
        title: "Visszajelzés és Roadmap",
        body: "Itt helyezd el a Featurebase widgetet vagy embed-kódot. A hely készen áll rá.",
        placeholder: "A Featurebase widget itt fog megjelenni.",
      },
      errors: {
        nameRequired: "A név kötelező",
        tooLong: "Túl hosszú",
        emailInvalid: "Érvénytelen e-mail",
        topicRequired: "Válassz témát",
        messageMin: "Mondj el egy kicsit többet (min. 10 karakter)",
        messageMax: "Tartsd 1500 karakter alatt",
      },
    },
  },
} as const;

export type Translations = typeof translations.en;
