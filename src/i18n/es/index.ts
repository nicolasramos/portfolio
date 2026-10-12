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
        signal:
          "La información vive dentro de tus sistemas y la gente sigue copiándola a un Excel para poder pensar.",
        shape: "Prueba piloto sobre tus datos reales y, si convence, paso a producción.",
        fits: [
          "El dato ya está ordenado dentro de tus sistemas",
          "Hay consultas que hoy hace una persona y se repiten",
          "Quieres saber qué sale de tu servidor antes de que salga",
        ],
        notFits: [
          "Buscas un chatbot para el sitio web",
          "No hay datos donde buscar todavía",
          "La única condición es pagar por usuario y mes",
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
        signal:
          "Cada cambio acaba en un parche que nadie entiende, o hay una versión vieja que da miedo tocar.",
        shape: "Alcance cerrado por proyecto, o continuidad mensual si el sistema es vivo.",
        fits: [
          "Odoo es tu columna vertebral, no un módulo suelto",
          "Hay personalizaciones acumuladas sin documentar",
          "Tienes una migración encima o se acerca",
        ],
        notFits: [
          "Quieres cambiar de ERP sin un motivo concreto",
          "Buscas instalar módulos sin revisarlos",
          "Nadie va a mantener lo que se monte",
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
        signal:
          "Hay algo que se hace a mano todas las semanas y todo el mundo asume que tiene que ser así.",
        shape: "Un proceso por vez, con una métrica desde el primer día.",
        fits: [
          "El proceso está definido, aunque esté en la cabeza de uno",
          "Las piezas tienen API o se pueden conectar",
          "Interesa saber qué pasó, cuándo y con qué resultado",
        ],
        notFits: [
          "El proceso cambia cada vez que se ejecuta",
          "Es un clic al día y ya",
          "El dato de origen todavía no existe",
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
        signal:
          "Funciona, pero nadie sabe cómo está montado ni qué pasaría si esta noche se cae.",
        shape: "Auditoría puntual con informe, o acompañamiento con hueco fijo en la agenda.",
        fits: [
          "Hay deuda técnica o de documentación acumulada",
          "Alguien se fue y se llevó el conocimiento",
          "Tu equipo quiere operar solo, pero con red",
        ],
        notFits: [
          "Buscas un proveedor que nunca te diga que no",
          "Documentar no entra en el presupuesto",
          "El objetivo es depender cada vez más de mí",
        ],
      },
    ],
  },
  selector: {
    eyebrow: "Autodiagnóstico",
    title: "Marca lo que te suena",
    intro:
      "No hace falta que sepas qué pedir. Marca una o dos frases: lo que encaja se queda encendido y lo demás se apaga.",
    footnote: "Ocurre aquí, en tu navegador. No se envía ni se guarda nada.",
    options: [
      { svc: "ia", label: "Mis datos no pueden salir de mi servidor" },
      { svc: "ia", label: "Consultar el ERP debería ser como preguntarle a alguien" },
      { svc: "odoo", label: "Mi Odoo está personalizado y da miedo tocarlo" },
      { svc: "odoo", label: "Tengo una migración o una versión vieja encima" },
      { svc: "auto", label: "Hay trabajo manual que se repite cada semana" },
      { svc: "eq", label: "Nadie sabe cómo está montado lo que ya funciona" },
    ],
  },
  needs: {
    eyebrow: "Antes de empezar",
    title: "Qué necesito de ti",
    intro:
      "Nada complicado. Con esto ya puedo decirte si puedo ayudarte, por dónde se empieza y qué no lo es.",
    items: [
      {
        t: "Dos frases del problema",
        d: "Qué pasa hoy, cada cuánto pasa y a quién le duele más.",
      },
      {
        t: "Acceso de lectura",
        d: "Una base de pruebas o un volco sin datos personales. Nunca credenciales de producción.",
      },
      {
        t: "Una persona de referencia",
        d: "Alguien que sepa dónde está el dato y pueda responder rápido.",
      },
      {
        t: "Dónde debe acabar",
        d: "El servidor, el entorno y quién lo administra cuando yo no esté.",
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
      "Seis repositorios propios. Las cifras son las mismas que ves en GitHub: las leo de su API con npm run refresh.",
    filterTitle: "Filtrar por lenguaje",
    filterAll: "Todos",
    barsTitle: "Así de usado está cada uno",
    barsHint: "Estrellas reales de GitHub, sin retocar.",
    issues: "issues y PRs abiertos",
    contributors: "colaboradores",
    release: "versión",
    created: "en marcha desde",
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
    openIssues: "Issues y PRs abiertos",
    license: "Licencia",
    contributors: "Colaboradores",
    release: "Última versión",
    created: "En marcha desde",
  },
} as const;
