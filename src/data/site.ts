export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

export const contact = {
  email: "contacto@nicolasramos.es",
  github: "https://github.com/nicolasramos",
  linkedin: "https://www.linkedin.com/in/nramosdev/",
  blog: "https://nramos.dev/",
  legal: {
    notice: "https://nramos.dev/aviso-legal/",
    privacy: "https://nramos.dev/privacidad/",
    cookies: "https://nramos.dev/cookies/",
  },
};

type PathMap = {
  home: string;
  services: string;
  projects: string;
  about: string;
  contact: string;
  project: (slug: string) => string;
};

export type PathMapKey = keyof PathMap | "other";

const paths: Record<Locale, PathMap> = {
  es: {
    home: "/",
    services: "/servicios/",
    projects: "/proyectos/",
    about: "/sobre-mi/",
    contact: "/contacto/",
    project: (slug: string) => `/proyectos/${slug}/`,
  },
  en: {
    home: "/en/",
    services: "/en/services/",
    projects: "/en/projects/",
    about: "/en/about/",
    contact: "/en/contact/",
    project: (slug: string) => `/en/projects/${slug}/`,
  },
};

export default paths;

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

const ROUTE_PAIRS: [string, string][] = [
  ["/", "/en/"],
  ["/servicios/", "/en/services/"],
  ["/proyectos/", "/en/projects/"],
  ["/sobre-mi/", "/en/about/"],
  ["/contacto/", "/en/contact/"],
];

function normalize(pathname: string): string {
  let path = pathname.replace(/index\.html$/, "").replace(/\.html$/, "");
  if (!path.endsWith("/")) path += "/";
  return path;
}

function projectSlug(path: string): string | null {
  const match = path.match(/^\/(?:proyectos|projects)\/([a-z0-9-]+)\/$/);
  return match ? match[1] : null;
}

/** Returns the es/en pair for a pathname, or an empty object when the page has no twin. */
export function alternatePaths(pathname: string): { es?: string; en?: string } {
  const path = normalize(pathname);
  const local = path === "/en/" || path.startsWith("/en/") ? "/" + path.slice(4) : path;
  for (const [es, en] of ROUTE_PAIRS) {
    if (es === local) return { es, en };
  }
  const slug = projectSlug(local);
  if (slug) return { es: `/proyectos/${slug}/`, en: `/en/projects/${slug}/` };
  return {};
}

