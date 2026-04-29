export type Lang = "en" | "hu";

export const translations = {
  en: {
    nav: { home: "Home", about: "About", work: "My Work", services: "Services", contact: "Contact" },
    help: { label: "Help", feedback: "Give Feedback", changelog: "What's New", chat: "Support Chat" },
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
      introAfter: "— building AI systems, leading communities, and sharing practical insights.",
      highlights: ["AI Automation", "Community Management", "Opinions & Insights"],
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
          role: "Mindset & Insight Reference",
          name: "Lucky Luc",
          body: "Mental frameworks, perspective, and practical observations for focus and resilience.",
        },
      ],
    },
    work: {
      eyebrow: "My Work",
      title: "Public",
      titleAccent: "work",
      intro: "A growing collection of the rooms I run, the systems I build, and the communities I help lead. Proof over promises.",
      visit: "Visit",
      items: [
        {
          title: "Ai Building & Automations",
          subtitle: "Artificial Intelligence",
          description:
            "Need a Website? An App? A Chatbot? CRM Support? Appointment setter? Leads scraper? I can build it for you in Three days to a Week... Speed is rule #1 of business. You cannot afford to be slow because you'll miss a lot of clients. Ai is the future, your business needs to implement it before it takes over you. And that's why it's future-proof. Ai doesn't sleep, Ai doesn't call in sick, Ai does not need days off. Get in on the future.",
          url: "",
          cta: "COMING SOON",
        },
        {
          title: "Head Manager & Admin of M.V.K",
          subtitle: "Community Management",
          description:
            "M.V.K (Magyar Vállalkozók Közössége) is a country-exclusive networking community for Hungary. Built for like-minded individuals — young or adult — who want to run their own business and step into the world of entrepreneurship. Think of it as the beginner-friendly answer to the famous Hungarian \"FIVOSZ\" entrepreneurship network, while still serving experienced founders.",
          url: "https://magyar-valalkozok.vercel.app/",
        },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "What I",
      titleAccent: "offer",
      intro: "Three lanes. One philosophy: build hard, lead clean, think clearly.",
      tags: { build: "Build", lead: "Lead", sharpen: "Insights" },
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
          title: "Opinions & Insights",
          body:
            "Straight opinions and practical insights on business, communication, sales fundamentals, and mental frameworks. Clear perspective when you want another sharp set of eyes on the situation.",
          bullets: [
            "Business and sales perspective",
            "Social skill and communication insights",
            "Mental frameworks and practical observations",
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
        name: "John Doe",
        email: "john.doe@example.com",
        message:
          "Tell me what you're building, where you're stuck, or what insight you want…",
      },
      topics: [
        "AI Automation",
        "Community Management",
        "Other/Insights",
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
    nav: { home: "Főoldal", about: "Rólam", work: "Munkáim", services: "Szolgáltatások", contact: "Kapcsolat" },
    help: { label: "Súgó", feedback: "Visszajelzés küldése", changelog: "Újdonságok", chat: "Ügyfélchat" },
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
      introAfter: " — AI-rendszereket építek, közösségeket vezetek, és gyakorlati meglátásokat osztok meg.",
      highlights: ["AI Automatizáció", "Közösségmenedzsment", "Vélemények és Meglátások"],
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
          role: "Gondolkodásmód és Meglátások",
          name: "Lucky Luc",
          body: "Mentális keretrendszerek, perspektíva és gyakorlati megfigyelések fókuszhoz és kitartáshoz.",
        },
      ],
    },
    work: {
      eyebrow: "Munkáim",
      title: "Nyilvános",
      titleAccent: "munkáim",
      intro: "Egyre bővülő gyűjtemény azokról a termekről, amiket vezetek, a rendszerekről, amiket építek, és a közösségekről, amelyeket segítek irányítani. Bizonyíték ígéretek helyett.",
      visit: "Megnyitás",
      items: [
        {
          title: "Ai Building & Automations",
          subtitle: "Artificial Intelligence",
          description:
            "Need a Website? An App? A Chatbot? CRM Support? Appointment setter? Leads scraper? I can build it for you in Three days to a Week... Speed is rule #1 of business. You cannot afford to be slow because you'll miss a lot of clients. Ai is the future, your business needs to implement it before it takes over you. And that's why it's future-proof. Ai doesn't sleep, Ai doesn't call in sick, Ai does not need days off. Get in on the future.",
          url: "",
          cta: "COMING SOON",
        },
        {
          title: "M.V.K Vezető Menedzser és Admin",
          subtitle: "Közösségmenedzsment",
          description:
            "Az M.V.K (Magyar Vállalkozók Közössége) egy Magyarországra kizárólagos networking közösség. Hasonlóan gondolkodó embereknek készült — fiataloknak és felnőtteknek egyaránt —, akik saját vállalkozást szeretnének vezetni, és belépnének a vállalkozói világba. Tekintsd a híres magyar „FIVOSZ\" vállalkozói hálózat kezdőbarát válaszának, miközben tapasztalt alapítóknak is értéket nyújt.",
          url: "https://magyar-valalkozok.vercel.app/",
        },
      ],
    },
    services: {
      eyebrow: "Szolgáltatások",
      title: "Amit",
      titleAccent: "kínálok",
      intro: "Három sáv. Egy filozófia: építs keményen, vezess tisztán, gondolkodj élesen.",
      tags: { build: "Építés", lead: "Vezetés", sharpen: "Meglátások" },
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
          title: "Vélemények és Meglátások",
          body:
            "Egyenes vélemények és gyakorlati meglátások üzletről, kommunikációról, értékesítési alapokról és mentális keretrendszerekről. Tiszta perspektíva, amikor jól jön egy éles külső szem.",
          bullets: [
            "Üzleti és értékesítési perspektíva",
            "Kommunikációs és szociális meglátások",
            "Mentális keretrendszerek és gyakorlati megfigyelések",
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
        name: "John Doe",
        email: "john.doe@example.com",
        message:
          "Mondd el, mit építesz, hol akadtál el, vagy milyen meglátást szeretnél…",
      },
      topics: [
        "AI Automatizáció",
        "Közösségmenedzsment",
        "Egyéb/Meglátások",
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
};

export type Translations = (typeof translations)["en"];
