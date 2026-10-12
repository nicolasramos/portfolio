import facts from "./repos.json";

/**
 * Facts (stars, forks, language, dates, license, open issues, contributors,
 * latest release) are read from GitHub by `npm run refresh`, which rewrites the
 * committed snapshot `src/data/repos.json`. The build itself never hits the API.
 */
export type Facts = {
  stars: number;
  forks: number;
  language: string;
  pushed: string;
  created: string;
  license: string | null;
  openIssues: number;
  contributors: number;
  release: string | null;
  defaultBranch: string;
};

type Narrative = {
  slug: string;
  /** Still from public/world/ used as the card's monochrome band. */
  art: string;
  repo: string;
  url: string;
  name: string;
  tagline: { es: string; en: string };
  body: { es: string[]; en: string[] };
  highlights: { es: string[]; en: string[] };
  stack: string[];
};

export type Project = Narrative & Facts;

const narrative: Narrative[] = [
  {
    slug: "odooclaw",
    art: "agents",
    repo: "nicolasramos/odooclaw",
    url: "https://github.com/nicolasramos/odooclaw",





    name: "OdooClaw",
    tagline: {
      es: "IA 100 por cien local para Odoo, con modelos entrenados por mí.",
      en: "Fully local AI for Odoo, with models I trained myself.",
    },
    body: {
      es: [
        "OdooClaw es un servidor MCP con kernel RLM que convierte a un agente en un usuario más de tu Odoo: consulta, crea y modifica registros, y lo hace sobre hardware tuyo. Nada viaja a una nube ajena y no hay suscripción mensual.",
        "Nació en un cliente que no podía sacar datos de la casa. Hoy cubre Odoo 16, 17 y 18, se acompaña de modelos propios publicados en Hugging Face y es el repositorio más visto de mi perfil.",
      ],
      en: [
        "OdooClaw is an MCP server with an RLM kernel that turns an agent into just another user of your Odoo: it queries, creates and edits records, and it does it on your own hardware. Nothing travels to somebody else's cloud and there is no monthly subscription.",
        "It was born in a client that could not move data off premise. Today it covers Odoo 16, 17 and 18, ships with my own models published on Hugging Face, and it is the most starred repository on my profile.",
      ],
    },
    highlights: {
      es: [
        "Servidor MCP listo para cualquier cliente que hable MCP",
        "Modelos propios publicados en Hugging Face",
        "Sin suscripción y con coste de inferencia predecible",
      ],
      en: [
        "MCP server ready for any MCP speaking client",
        "My own models published on Hugging Face",
        "No subscription and a predictable inference cost",
      ],
    },
    stack: ["Go", "MCP", "Odoo 16/17/18", "Hugging Face", "RLM kernel"],
  },
  {
    slug: "odoo-addons",
    art: "system",
    repo: "nicolasramos/odoo-addons",
    url: "https://github.com/nicolasramos/odoo-addons",





    name: "odoo-addons",
    tagline: {
      es: "Módulos Odoo públicos, instalables desde cualquier addons path.",
      en: "Public Odoo addons, installable from any addons path.",
    },
    body: {
      es: [
        "Repositorio de addons instalables por la vía estándar: addons path, agregador de Git, submódulo o plantilla de despliegue. Aquí vive odoo_agent, el sistema de ejecución de agentes dentro de Odoo Project con runtime, ejecuciones, logs, skills y menciones.",
        "También mantengo aquí la familia mail_bot_odooclaw, que lleva los agentes al chat de Odoo Discuss mediante webhooks y añade asistencia proactiva en contabilidad.",
      ],
      en: [
        "A repository of installable addons through the standard route: addons path, Git aggregator, submodule or deployment template. This is where odoo_agent lives, the agent execution system inside Odoo Project with runtimes, executions, logs, skills and mentions.",
        "I also maintain the mail_bot_odooclaw family here, which brings the agents into Odoo Discuss chat through webhooks and adds proactive help in accounting.",
      ],
    },
    highlights: {
      es: [
        "odoo_agent para Odoo 18 con logs y skills",
        "mail_bot_odooclaw cubre Odoo 16 a 19",
        "Pensado para consumo en proyectos de clientes",
      ],
      en: [
        "odoo_agent for Odoo 18 with logs and skills",
        "mail_bot_odooclaw covers Odoo 16 to 19",
        "Built to be consumed inside client projects",
      ],
    },
    stack: ["Python", "Odoo 16/17/18/19", "Webhooks", "Odoo Discuss"],
  },
  {
    slug: "odooclaw-mcp",
    art: "brief",
    repo: "nicolasramos/odooclaw-mcp",
    url: "https://github.com/nicolasramos/odooclaw-mcp",





    name: "odooclaw-mcp",
    tagline: {
      es: "Servidor MCP independiente para Odoo 18 sobre stdio.",
      en: "Standalone MCP server for Odoo 18 over stdio.",
    },
    body: {
      es: [
        "La versión empaquetada para quien solo necesita conectar un agente a Odoo 18 sin montar el stack completo. Se instala con pip, se llama odooclaw-mcp y mantiene alias históricos para no romper configuraciones antiguas.",
        "Al hablar por stdio funciona con cualquier cliente MCP de escritorio o de servidor sin abrir puertos adicionales.",
      ],
      en: [
        "The packaged version for anyone who only needs to connect an agent to Odoo 18 without running the full stack. It installs with pip, it is called odooclaw-mcp, and it keeps historic aliases so old setups keep working.",
        "Speaking over stdio means it works with any desktop or server MCP client without opening extra ports.",
      ],
    },
    highlights: {
      es: [
        "Instalación con pip y CLI propia",
        "Transporte stdio, sin puertos abiertos",
        "Alias de compatibilidad incluidos",
      ],
      en: [
        "pip install with its own CLI",
        "stdio transport, no open ports",
        "Compatibility aliases included",
      ],
    },
    stack: ["Python", "MCP", "stdio", "PyPI"],
  },
  {
    slug: "odoo-agent-runtime",
    art: "automation",
    repo: "nicolasramos/odoo-agent-runtime",
    url: "https://github.com/nicolasramos/odoo-agent-runtime",





    name: "odoo-agent-runtime",
    tagline: {
      es: "Runtime multiplataforma para el sistema de agentes de Odoo.",
      en: "Cross platform runtime for the Odoo agent system.",
    },
    body: {
      es: [
        "La pieza que ejecuta los agentes fuera de Odoo y devuelve el resultado al sistema. Corre en Linux, macOS y Windows, registra cada ejecución y deja los logs donde un humano puede auditarlos.",
        "Es la capa que convierte una idea de agente en algo operable: colas, reinicios, límites de recursos y trazas.",
      ],
      en: [
        "The piece that runs agents outside Odoo and returns the result to the system. It runs on Linux, macOS and Windows, records every execution and leaves logs where a human can audit them.",
        "It is the layer that turns an agent idea into something operable: queues, restarts, resource limits and traces.",
      ],
    },
    highlights: {
      es: [
        "Mismo runtime en tres sistemas",
        "Cada ejecución queda registrada y auditada",
        "Límites de recursos y reinicios controlados",
      ],
      en: [
        "Same runtime across three operating systems",
        "Every execution recorded and auditable",
        "Resource limits and controlled restarts",
      ],
    },
    stack: ["Python", "CLI", "Linux/macOS/Windows", "Logging"],
  },
  {
    slug: "openproject-vscode-extension",
    art: "workshop",
    repo: "nicolasramos/openproject-vscode-extension",
    url: "https://github.com/nicolasramos/openproject-vscode-extension",





    name: "openproject-vscode-extension",
    tagline: {
      es: "Gestiona tus work packages de OpenProject desde VS Code.",
      en: "Manage your OpenProject work packages from VS Code.",
    },
    body: {
      es: [
        "Un complemento de VS Code para no salir del editor: árbol de proyectos, tus tareas asignadas, leer y escribir comentarios y recibir avisos cuando alguien contesta.",
        "Lo escribí porque perder el hilo entre el editor y el gestor de proyectos costaba más tiempo del que parecía.",
      ],
      en: [
        "A VS Code extension so you never leave the editor: project tree, your assigned tasks, reading and writing comments, and notifications when somebody replies.",
        "I wrote it because losing the thread between the editor and the project manager was costing more time than it seemed.",
      ],
    },
    highlights: {
      es: [
        "Vista de proyectos en árbol",
        "Tareas asignadas y comentarios desde el editor",
        "Notificaciones push de respuestas",
      ],
      en: [
        "Tree view of your projects",
        "Assigned tasks and comments inside the editor",
        "Push notifications for replies",
      ],
    },
    stack: ["TypeScript", "VS Code API", "OpenProject REST"],
  },
  {
    slug: "odooclaw-doodba",
    art: "finale",
    repo: "nicolasramos/odooclaw-doodba",
    url: "https://github.com/nicolasramos/odooclaw-doodba",





    name: "odooclaw-doodba",
    tagline: {
      es: "Plantilla Doodba para arrancar Odoo con OdooClaw de forma segura.",
      en: "Doodba template to start Odoo with OdooClaw the safe way.",
    },
    body: {
      es: [
        "Una plantilla sobre el copier template de Tecnativa, preparada para clonar y arrancar con valores por defecto seguros: sin claves privadas en ficheros versionados y con el flujo diario de Doodba intacto.",
        "Es el punto de partida que uso en proyectos reales, sobre Odoo 18 y la plantilla v9.4.1.",
      ],
      en: [
        "A template on top of Tecnativa's copier template, ready to clone and bootstrap with safe defaults: no private keys in tracked files and the daily Doodba workflow untouched.",
        "It is the starting point I use in real projects, on Odoo 18 with template v9.4.1.",
      ],
    },
    highlights: {
      es: [
        "Arranque rápido sin secretos versionados",
        "Flujo Doodba: git aggregate, img build, resetdb",
        "Basada en doodba-copier-template v9.4.1",
      ],
      en: [
        "Fast bootstrap with no secrets in tracked files",
        "Doodba flow: git aggregate, img build, resetdb",
        "Built on doodba-copier-template v9.4.1",
      ],
    },
    stack: ["Doodba", "Odoo 18", "Docker", "Copier"],
  },
];

const known = facts.repos as Record<string, Facts>;

const projects: Project[] = narrative.map((entry) => {
  const repo = known[entry.repo];
  if (!repo) {
    throw new Error(`src/data/repos.json has no facts for ${entry.repo} — run npm run refresh`);
  }
  return { ...entry, ...repo };
});

export default projects;

export const totals = {
  stars: projects.reduce((sum, p) => sum + p.stars, 0),
  forks: projects.reduce((sum, p) => sum + p.forks, 0),
  repos: projects.length,
};

export const languages = [...new Set(projects.map((p) => p.language))].sort();
