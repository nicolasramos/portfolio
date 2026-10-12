export default {
  meta: {
    title: "Nicolás Ramos · Odoo e IA para empresas",
    description:
      "Agentes de IA locales, Odoo y automatización empresarial. Diseño sistemas que corren en tu propio servidor, con modelos propios y sin suscripciones.",
    locale: "es_ES",
  },
  nav: {
    home: "Inicio",
    services: "Servicios",
    projects: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
    other: "English",
  },
  skip: "Saltar al contenido",
  hero: {
    eyebrow: "Odoo · IA local · Automatización",
    title: ["IA que trabaja", "dentro de tu empresa"],
    subtitle:
      "Construyo agentes de IA y sistemas Odoo que corren en tu propio servidor. Tus datos no salen de casa y no dependes de una suscripción.",
    primary: "Pedir diagnóstico",
    secondary: "Ver proyectos",
    proof: "89 estrellas y 48 forks en GitHub. OdooClaw funciona con Odoo 16, 17 y 18.",
  },
  proof: {
    items: [
      { value: "15 años", label: "trabajando con Odoo" },
      { value: "89", label: "estrellas en GitHub" },
      { value: "100%", label: "local, sin nube obligatoria" },
      { value: "3", label: "versiones de Odoo cubiertas" },
    ],
  },
  tagline: {
    text: "Agentes que trabajan contigo, sistemas que se administran solos y datos que nunca salen de tu servidor.",
  },
  services: {
    eyebrow: "Qué hago",
    title: "Cuatro formas de trabajar juntos",
    intro:
      "Todo lo que ofrezco es la misma cosa: que tu software deje de ser una caja negra y empiece a trabajar para ti.",
    items: [
      {
        key: "ia",
        title: "Agentes de IA sobre tus datos",
        body:
          "Monto agentes que leen, escriben y ejecutan dentro de tus sistemas usando OdooClaw, mi servidor MCP con modelos entrenados por mí. Cero dependencias de nube cuando tiene sentido tenerlas.",
        points: [
          "Modelos propios en tu hardware",
          "Servidor MCP para cualquier cliente",
          "Soberanía de datos y coste predecible",
        ],
      },
      {
        key: "odoo",
        title: "Odoo sin sustos",
        body:
          "Implementación, migraciones y módulos a medida sobre flujos de trabajo reales. Tu Odoo tiene que parecer hecho a medida, no una instalación genérica.",
        points: [
          "Migraciones desde 14, 16 y 17",
          "Módulos propios mantenibles",
          "Despliegue con Doodba y Coolify",
        ],
      },
      {
        key: "auto",
        title: "Automatización de procesos",
        body:
          "Conecto lo que ya tienes: Odoo, correo, almacén, contabilidad y herramientas sueltas. El trabajo repetitivo desaparece y el equipo se queda con lo que sí aporta valor.",
        points: [
          "Integraciones e APIs",
          "Tareas programadas y alertas",
          "Trazabilidad de cada ejecución",
        ],
      },
      {
        key: "eq",
        title: "Soporte, auditoría y formación",
        body:
          "Reviso instalaciones existentes, dejo la infraestructura documentada y enseño a tu equipo a operar el sistema sin depender de mí para siempre.",
        points: [
          "Auditoría de rendimiento y seguridad",
          "Documentación y traspaso real",
          "Mantenimiento evolutivo",
        ],
      },
    ],
  },
  process: {
    eyebrow: "Cómo empieza",
    title: "Tres pasos y al trabajo",
    intro:
      "Nada de propuestas de cuarenta páginas. Primero entendemos el problema, luego lo probamos y después lo dejamos en producción.",
    steps: [
      {
        n: "01",
        title: "Diagnóstico",
        body:
          "Una sesión de trabajo sobre tus procesos y tu instalación actual. Salimos con el problema concreto y qué merece la pena automatizar.",
      },
      {
        n: "02",
        title: "Prototipo funcional",
        body:
          "Construyo algo que ya funcione sobre tus datos reales. Lo ves, lo tocas y decidimos con evidencia en vez de con intuición.",
      },
      {
        n: "03",
        title: "Producción y evolución",
        body:
          "Despliegue, monitorización y documentación. Después, mantenimiento evolutivo con el equipo de tu empresa al mando.",
      },
    ],
  },
  projectsSection: {
    eyebrow: "Código público",
    title: "Lo que puedes revisar antes de escribirme",
    intro:
      "Mantengo open source de verdad, con clientes usándolo. Aquí están los repositorios que más me representan.",
    cta: "Ver todos los repositorios",
    stars: "estrellas",
    forks: "forks",
    detail: "Ver detalle",
    total: "89 estrellas acumuladas en estos seis repositorios",
  },
  faq: {
    eyebrow: "Dudas frecuentes",
    title: "Lo que suelen preguntarme",
    items: [
      {
        q: "¿Qué es un agente de IA sobre mis propios datos?",
        a: "Un programa que puede leer tus registros, entender lo que le pides con lenguaje natural y ejecutar acciones reales en tus sistemas. No es un chat que responde texto: es un trabajador más dentro del software que ya usas.",
      },
      {
        q: "¿Tengo que dejar de usar Odoo?",
        a: "No. Odoo suele ser la base del proyecto. Lo que hago es que Odoo trabaje contigo: agentes que consultan, crean y mueven registros por ti, y automatizaciones que se ejecutan solas.",
      },
      {
        q: "¿Con qué versiones de Odoo trabajas?",
        a: "Trabajo con Odoo 16, 17 y 18 en proyectos nuevos, y con migraciones desde 14 y 16. También mantengo instalaciones antiguas mientras tengan sentido económico.",
      },
      {
        q: "¿Los modelos tienen que estar en la nube?",
        a: "No tienen por qué. OdooClaw está pensado para funcionar al cien por cien en local con modelos propios. Cuando una API externa aporta más calidad que un modelo local, se integra, pero siempre sabiendo qué sale de tu servidor.",
      },
      {
        q: "¿Cómo empieza un proyecto?",
        a: "Con un diagnóstico. Me cuentas el problema, miro lo que ya tienes y te devuelvo un alcance cerrado con fases. No hay tarifas públicas porque cada empresa tiene un punto de partida distinto.",
      },
      {
        q: "¿Puedo ver código tuyo antes de contratar?",
        a: "Cuenta con ello. Todo mi trabajo público está en GitHub, con las estrellas y los forks que puedes comprobar tú mismo. El repositorio más grande es OdooClaw.",
      },
      {
        q: "¿En qué idiomas trabajas?",
        a: "En español y en inglés, tanto en la documentación como en las reuniones con el equipo.",
      },
    ],
  },
  finalCta: {
    title: "Cuéntame qué te está frenando",
    body:
      "Respuesta en menos de dos días laborables. Si veo que no puedo ayudarte, te lo digo y te oriento hacia otra persona.",
    primary: "Escribir ahora",
    secondary: "Ver servicios",
  },
  about: {
    eyebrow: "Sobre mí",
    title: "Quince años haciendo que el software trabaje para la empresa",
    lead:
      "Empecé con Odoo cuando todavía se llamaba OpenERP y sigo aquí porque es la pieza que ordena una empresa. Desde hace unos años, además, construyo los agentes de IA que lo hacen funcionar solo.",
    body: [
      "Trabajo desde Tenerife, Islas Canarias, para empresas de España y de otros países de la Unión Europea. He pasado por implementaciones críticas, migraciones que no podían fallar y fábricas donde un minuto de parada se paga.",
      "Mi forma de trabajar es sencilla: primero entiendo el negocio, luego escribo código y después dejo que tu equipo lo maneje. No me interesa un proyecto que solo yo pueda mantener.",
      "Todo lo que puedo publicar, lo publico. OdooClaw nació de un cliente que no quería sacar sus datos de la casa y hoy es el repositorio con más estrellas de mi perfil.",
    ],
    factsTitle: "Datos rápidos",
    facts: [
      { label: "Base", value: "Tenerife, Islas Canarias" },
      { label: "Zona horaria", value: "CET, UTC+1" },
      { label: "Idiomas", value: "Español e inglés" },
      { label: "Publico en", value: "nramos.dev" },
    ],
    stackTitle: "Herramientas de cada día",
    stack: [
      "Odoo 14 a 19",
      "Python",
      "Go",
      "TypeScript",
      "Astro",
      "PostgreSQL",
      "Docker y Doodba",
      "Coolify",
      "MCP",
      "PyTorch",
    ],
  },
  servicesPage: {
    eyebrow: "Servicios",
    title: "Del diagnóstico a producción",
    intro:
      "Cuatro servicios que se pueden contratar sueltos o como un camino completo. Todos terminan igual: algo funcionando en tu servidor y tu equipo sabiendo usarlo.",
  },
  projectsPage: {
    eyebrow: "Proyectos",
    title: "Open source que se usa en producción",
    intro:
      "Seis repositorios propios. Las cifras de estrellas y forks vienen de la API de GitHub y se actualizan con cada build.",
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos de tu proyecto",
    intro:
      "Escríbeme con lo que te está costando dinero o tiempo. Con dos frases me basta para saber si puedo ayudarte.",
    emailLabel: "Email directo",
    copyLabel: "Copiar email",
    copiedLabel: "Copiado",
    mailSubject: "Consulta sobre un proyecto",
    mailBody:
      "Hola Nicolás:\n\nMe gustaría hablar de\n\n1.\n2.\n\nUn saludo.",
    linksTitle: "También por aquí",
    formNote:
      "El formulario con envío directo está pendiente de una clave de servicio. Mientras tanto, el botón abre tu cliente de correo con el asunto y el cuerpo ya escritos.",
    availability: {
      title: "Cómo trabajamos",
      items: [
        "Primera conversación de 30 minutos, sin coste.",
        "Presupuesto cerrado por alcance después del diagnóstico.",
        "Contrato en español o en inglés.",
      ],
    },
  },
  footer: {
    tagline: "Odoo, IA local y automatización para empresas que quieren decidir más rápido.",
    menu: "Navegación",
    more: "Más sitios",
    blog: "Blog en nramos.dev",
    github: "GitHub",
    linkedin: "LinkedIn",
    legal: "Aviso legal",
    privacy: "Política de privacidad",
    cookies: "Política de cookies",
    rights: "Todos los derechos reservados.",
    built: "Hecho con Astro, sin JavaScript innecesario.",
  },
  notFound: {
    code: "404",
    title: "Esta página no existe",
    body: "Puede que el enlace esté viejo o mal escrito. Desde aquí se vuelve a casa.",
    cta: "Volver al inicio",
  },
  project: {
    back: "Volver a proyectos",
    overview: "Qué es",
    highlights: "Qué resuelve",
    stack: "Tecnología",
    stats: "Datos del repositorio",
    repo: "Repositorio",
    updated: "Último push",
    language: "Lenguaje",
    stars: "Estrellas",
    forks: "Forks",
    visit: "Abrir en GitHub",
    related: "Otros proyectos",
  },
} as const;
