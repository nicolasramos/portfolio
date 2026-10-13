import type { Locale } from "./site";
import paths from "./site";

/**
 * The six stops of the monochrome scroll world. Video and stills are generated
 * locally on the audiovisual PC (ComfyUI: JuggernautXL stills -> Wan 2.2 TI2V 5B).
 * Nothing here is invented: services, repos and contact come from the same data
 * the inner pages use.
 */
export type WorldStop = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  still: string;
  clip: string;
  cta?: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
};

const COPY: Record<Locale, Record<string, Omit<WorldStop, "still" | "clip">>> = {
  es: {
    brief: {
      id: "brief",
      label: "El encargo",
      eyebrow: "01 · El encargo",
      title: "Todo empieza con un problema real",
      body: "Antes de tocar nada, entender el negocio: qué duele, qué cuesta dinero y qué debería dejar de hacerse a mano.",
      tags: ["Diagnóstico", "Proceso", "Sin compromiso"],
    },
    system: {
      id: "system",
      label: "El sistema",
      eyebrow: "02 · Odoo",
      title: "El sistema ordena el caos",
      body: "ERP a medida sobre Odoo: ventas, inventario, contabilidad y TPV hablando entre sí, sin hojas de cálculo paralelas.",
      tags: ["Implantación", "Migraciones", "Personalización"],
    },
    agents: {
      id: "agents",
      label: "Los agentes",
      eyebrow: "03 · IA aplicada",
      title: "Agentes que trabajan de madrugada",
      body: "Agentes sobre modelos locales que clasifican, redactan, revisan y avisan. Los datos no salen de casa.",
      tags: ["Modelos locales", "MCP", "Integración con Odoo"],
    },
    automation: {
      id: "automation",
      label: "Automatización",
      eyebrow: "04 · Automatización",
      title: "La máquina trabaja sola",
      body: "Flujos, integraciones y reglas: lo que antes era copiar y pegar hoy ocurre sin intervención humana.",
      tags: ["Workflows", "APIs", "Sin copia-pega"],
    },
    workshop: {
      id: "workshop",
      label: "El taller",
      eyebrow: "05 · Open source",
      title: "El taller está abierto",
      body: "OdooClaw, odoo-addons y el runtime del agente están publicados: el trabajo se comparte, se audita y se reutiliza.",
      tags: ["OdooClaw", "odoo-addons", "odooclaw-mcp"],
    },
    finale: {
      id: "finale",
      label: "Hablemos",
      eyebrow: "06 · Contacto",
      title: "Hablemos de tu máquina",
      body: "Cuéntame el atasco y te digo qué se automatiza, qué no vale la pena y cuánto cuesta.",
      tags: ["contacto@nicolasramos.es"],
    },
  },
  en: {
    brief: {
      id: "brief",
      label: "The brief",
      eyebrow: "01 · The brief",
      title: "It starts with a real problem",
      body: "Before touching anything: understand the business, what hurts, what costs money and what should stop being manual.",
      tags: ["Diagnosis", "Process", "No commitment"],
    },
    system: {
      id: "system",
      label: "The system",
      eyebrow: "02 · Odoo",
      title: "The system orders the chaos",
      body: "Custom Odoo ERP: sales, inventory, accounting and POS talking to each other, no parallel spreadsheets.",
      tags: ["Rollout", "Migrations", "Custom modules"],
    },
    agents: {
      id: "agents",
      label: "The agents",
      eyebrow: "03 · Applied AI",
      title: "Agents that work at dawn",
      body: "Agents on local models that classify, draft, review and alert. Your data never leaves the building.",
      tags: ["Local models", "MCP", "Odoo integration"],
    },
    automation: {
      id: "automation",
      label: "Automation",
      eyebrow: "04 · Automation",
      title: "The machine runs itself",
      body: "Workflows, integrations and rules: what used to be copy-paste now happens with no human in the loop.",
      tags: ["Workflows", "APIs", "No copy-paste"],
    },
    workshop: {
      id: "workshop",
      label: "The workshop",
      eyebrow: "05 · Open source",
      title: "The workshop is open",
      body: "OdooClaw, odoo-addons and the agent runtime are published: the work is shared, audited and reused.",
      tags: ["OdooClaw", "odoo-addons", "odooclaw-mcp"],
    },
    finale: {
      id: "finale",
      label: "Let's talk",
      eyebrow: "06 · Contact",
      title: "Let's talk about your machine",
      body: "Tell me the bottleneck and I'll tell you what to automate, what is not worth it and what it costs.",
      tags: ["contacto@nicolasramos.es"],
    },
  },
};

const ORDER = ["brief", "system", "agents", "automation", "workshop", "finale"];

export function worldStops(locale: Locale): WorldStop[] {
  const p = paths[locale];
  return ORDER.map((key) => {
    const stop = COPY[locale][key];
    return {
      ...stop,
      still: `/world/${stop.id}.webp`,
      clip: `/world/${stop.id}.mp4`,
      ...(stop.id === "finale"
        ? {
            cta: {
              primary: { label: locale === "es" ? "Escríbeme" : "Write to me", href: p.contact },
              secondary: {
                label: locale === "es" ? "Ver proyectos" : "See projects",
                href: p.projects,
              },
            },
          }
        : {}),
    };
  });
}

export function worldChrome(locale: Locale) {
  const p = paths[locale];
  return {
    brand: { name: locale === "es" ? "nicolás ramos" : "nicolas ramos", href: p.home },
    cta: { label: locale === "es" ? "Contacto" : "Contact", href: p.contact },
    hint: locale === "es" ? "scroll para mover la máquina" : "scroll to move the machine",
    aria:
      locale === "es"
        ? "Recorrido por la máquina: encargo, sistema Odoo, agentes de IA, automatización, taller open source y contacto."
        : "A walk through the machine: the brief, the Odoo system, AI agents, automation, the open-source workshop and contact.",
  };
}
