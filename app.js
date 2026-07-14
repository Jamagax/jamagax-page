const MODELS = [
  {
    name: "Teseracto Polyhedra",
    type: { es: "Geometría espacial", en: "Spatial geometry" },
    description: { es: "Simetría multidimensional, estelaciones y detalle recursivo convertidos en una pieza escultórica.", en: "Multidimensional symmetry, stellations and recursive detail transformed into a sculptural piece." },
    source: "jamagax_models/Escultura_Polyhedra.glb"
  },
  {
    name: "M-Size Shell",
    type: { es: "Fabricación aditiva", en: "Additive manufacturing" },
    description: { es: "Superficie de doble curvatura racionalizada para ventilación, ligereza e impresión 3D.", en: "A double-curved surface rationalized for ventilation, lightness and 3D printing." },
    source: "jamagax_models/M-Size.glb"
  },
  {
    name: "Templo de Morfeo",
    type: { es: "Arquitectura paramétrica", en: "Parametric architecture" },
    description: { es: "Una investigación espacial de arcos continuos, bóvedas fluidas y luz tropical.", en: "A spatial exploration of continuous arches, fluid vaults and tropical light." },
    source: "jamagax_models/TemploDeMorfeo.glb"
  },
  {
    name: "A-Frame",
    type: { es: "Sistema constructivo", en: "Building system" },
    description: { es: "Una estructura modular que usa repetición, triangulación y ensamblaje como lenguaje.", en: "A modular structure that uses repetition, triangulation and assembly as its language." },
    source: "jamagax_models/A-Frame.glb"
  }
];

let activeModel = 0;
let scene;
let camera;
let renderer;
let controls;
let currentObject;
let loadToken = 0;
let resizeObserver;
let currentLanguage = "es";
let heroFocusController;

const TRANSLATIONS = {
  "Ir al contenido": "Skip to content",
  "Abrir menú": "Open menu",
  "Estudio": "Studio",
  "Proyectos": "Projects",
  "Servicios": "Services",
  "Método": "Method",
  "Iniciar un proyecto": "Start a project",
  "Tulum, México": "Tulum, Mexico",
  "Afinamos con": "We refine",
  "intención": "matter",
  "la materia.": "with intention.",
  "Transmisión JX—001": "Transmission JX—001",
  "Señal estable": "Stable signal",
  "Diseño computacional, modelado orgánico/paramétrico y desarrollo con inteligencia artificial para traducir patrones, datos e intuiciones en materia.": "Computational design, organic/parametric modeling and artificial intelligence development to translate patterns, data and intuition into matter.",
  "Explorar el estudio": "Explore the studio",
  "Cuéntanos tu idea": "Tell us your idea",
  "Proyectos destacados": "Featured projects",
  "Proyectos destacados; pulsa para ocultar la interfaz": "Featured projects; click to hide the interface",
  "Contemplar la señal": "View the signal",
  "Recuperar la interfaz": "Restore the interface",
  "Diseño paramétrico": "Parametric design",
  "Señal · Código · Forma · Materia": "Signal · Code · Form · Matter",
  "Diseño computacional": "Computational design",
  "El estudio": "The studio",
  "Traducimos aquello que": "We translate what",
  "aún no tiene forma.": "has not yet taken form.",
  "Jamagax Studio es el laboratorio creativo de": "Jamagax Studio is the creative laboratory of",
  ": una interfaz entre información, geometría y materia. Convertimos patrones, fuerzas y datos en sistemas que pueden verse, probarse y fabricarse.": ": an interface between information, geometry and matter. We turn patterns, forces and data into systems that can be seen, tested and fabricated.",
  "Desde Tulum colaboramos con arquitectos, artistas, desarrolladores y marcas en proyectos que requieren geometría no estándar, racionalización y control real de producción.": "From Tulum, we collaborate with architects, artists, developers and brands on projects requiring non-standard geometry, rationalization and true production control.",
  "Años entre diseño y fabricación digital": "Years spanning design and digital fabrication",
  "Piezas CNC racionalizadas para Mayan Warrior": "CNC parts rationalized for Mayan Warrior",
  "Maquetas 3D producidas para Azulik": "3D models produced for Azulik",
  "Director del estudio": "Studio director",
  "Diseñador industrial y Maestro en Arquitectura Sustentable. Fundador de Dimensión N, autor de": "Industrial designer and Master in Sustainable Architecture. Founder of Dimensión N, author of",
  "y pionero de la enseñanza de Grasshopper en Latinoamérica.": "and a pioneer in Grasshopper education in Latin America.",
  "Fue Fab Lab Manager y Director de Producción en Roth Architecture–Azulik, líder de diseño computacional para Mayan Warrior y profesor en Ibero, CENTRO, Anáhuac y Tecnológico de Monterrey.": "Former Fab Lab Manager and Production Director at Roth Architecture–Azulik, computational design lead for Mayan Warrior, and professor at Ibero, CENTRO, Anáhuac and Tecnológico de Monterrey.",
  "CV en español": "CV in Spanish",
  "Portafolio completo": "Full portfolio",
  "Evidencias materializadas": "Materialized evidence",
  "Ideas complejas.": "Complex ideas.",
  "Realidad precisa.": "Precise reality.",
  "Una trayectoria que cruza arquitectura, arte monumental, fabricación industrial, producto e interfaces sensibles.": "A body of work spanning architecture, monumental art, industrial fabrication, product design and responsive interfaces.",
  "Estrategia computacional, nesting, código G y secuencia de ensamblaje para más de 1,500 componentes únicos mecanizados en CNC.": "Computational strategy, nesting, G-code and assembly sequencing for more than 1,500 unique CNC-machined components.",
  "Dirección de fabricación de moldes MDF a gran escala y componentes orgánicos en maderas exóticas.": "Fabrication direction for large-scale MDF molds and organic components in exotic woods.",
  "Silla impresa en 3D": "3D-printed chair",
  "Una pieza exterior de menos de 3 kg, optimizada para imprimirse en gran formato en menos de 24 horas.": "An outdoor piece weighing under 3 kg, optimized for large-format printing in less than 24 hours.",
  "Participación en el equipo inicial de diseño de fachada para una de las primeras aplicaciones emblemáticas del diseño paramétrico en México.": "Part of the initial façade design team for one of Mexico’s earliest landmark applications of parametric design.",
  "Sistema de exhibición en fieltro para NeoCon, automatizado desde la geometría hasta planos y archivos de corte.": "A felt exhibition system for NeoCon, automated from geometry through drawings and cutting files.",
  "Personajes, moldes y producción para marcas, concursos y talleres: del modelado a la pieza pintada.": "Characters, molds and production for brands, competitions and workshops—from modeling to the painted piece.",
  "Investigación aplicada": "Applied research",
  "Otras": "Other",
  "frecuencias.": "frequencies.",
  "Ingeniería DfM para una escultura ambiental de Burning Man que obtiene agua potable de la humedad atmosférica.": "DfM engineering for a Burning Man environmental sculpture that harvests drinking water from atmospheric humidity.",
  "Interfaz de audio que convierte las frecuencias electromagnéticas de motores paso a paso en sonido de 8 bits.": "An audio interface that turns the electromagnetic frequencies of stepper motors into 8-bit sound.",
  "Sensores capacitivos y audio generativo para transformar el impacto físico de gotas de agua en música.": "Capacitive sensors and generative audio transform the physical impact of water droplets into music.",
  "Estación meteorológica autónoma financiada por CONACYT para telemetría y registro climático en lugares remotos.": "A CONACYT-funded autonomous weather station for telemetry and climate recording in remote locations.",
  "Archivo extradimensional": "Extradimensional archive",
  "Geometrías emergentes": "Emerging geometries",
  "Explora cómo la información toma cuerpo: arrastra para rotar y usa la rueda para acercarte.": "Explore how information takes form: drag to rotate and use the wheel to zoom.",
  "Señal materializada": "Materialized signal",
  "Cargando geometría": "Loading geometry",
  "Operaciones de transmutación": "Transmutation operations",
  "Del concepto": "From concept",
  "a la materia.": "to matter.",
  "Interpretamos información compleja y la conducimos por una cadena precisa: intuición, geometría, simulación y fabricación.": "We interpret complex information and guide it through a precise chain: intuition, geometry, simulation and fabrication.",
  "Diseño computacional y orgánico": "Computational and organic design",
  "Form-finding, sistemas paramétricos, simulación física y herramientas a medida para controlar geometrías complejas.": "Form-finding, parametric systems, physical simulation and custom tools for controlling complex geometries.",
  "Captura de realidad y mallas": "Reality capture and meshes",
  "Fotogrametría, escaneo 3D, point clouds, Gaussian Splatting y reparación de datos pesados para obtener geometría limpia.": "Photogrammetry, 3D scanning, point clouds, Gaussian Splatting and heavy-data repair to obtain clean geometry.",
  "DfM y fabricación digital": "DfM and digital fabrication",
  "Racionalización, nesting, G-code, impresión 3D, CNC y documentación directa a máquina para producir sin improvisación.": "Rationalization, nesting, G-code, 3D printing, CNC and machine-ready documentation for reliable production.",
  "Sistemas interactivos e IA": "Interactive systems and AI",
  "Electrónica, sensores, gemelos 3D web y agentes con LLM/MCP que conectan espacios, datos y procesos de diseño.": "Electronics, sensors, web-based 3D twins and LLM/MCP agents connecting spaces, data and design processes.",
  "“La forma no se impone.": "“Form is not imposed.",
  "La forma": "Form",
  "emerge": "emerges",
  "de las": "from the",
  "fuerzas que la atraviesan.": "forces that move through it.",
  "Manifiesto Jamagax": "Jamagax Manifesto",
  "Leemos fuerzas invisibles —continuidad, tensión y flujo— y las convertimos en decisiones geométricas verificables.": "We read invisible forces—continuity, tension and flow—and turn them into verifiable geometric decisions.",
  "Protocolo de traducción": "Translation protocol",
  "Un proceso": "A process",
  "sin cajas negras.": "without black boxes.",
  "La transformación no es magia: cada decisión conecta una intención con una regla, una geometría y un resultado fabricable.": "Transformation is not magic: every decision connects an intention to a rule, a geometry and a fabricable result.",
  "Concepto y forma": "Concept and form",
  "Definimos el ADN geométrico, las fuerzas y los criterios del proyecto.": "We define the project’s geometric DNA, forces and criteria.",
  "Lógica algorítmica": "Algorithmic logic",
  "Construimos un sistema paramétrico para iterar con velocidad y control.": "We build a parametric system for fast, controlled iteration.",
  "Racionalización y DfM": "Rationalization and DfM",
  "Paneles, uniones, tolerancias y secuencias se validan antes de fabricar.": "Panels, joints, tolerances and sequences are validated before fabrication.",
  "Directo a máquina": "Direct to machine",
  "Entregamos G-code, DXF anidados, robot paths o archivos de impresión listos.": "We deliver production-ready G-code, nested DXFs, robot paths or print files.",
  "Diseño computacional · DfM · consultoría técnica": "Computational design · DfM · technical consulting",
  "¿Tienes una idea que aún": "Do you have an idea that",
  "no encuentra forma?": "has not yet found its form?",
  "Traigámosla": "Let’s bring it",
  "a esta dimensión.": "into this dimension.",
  "Ecosistema Dimension N": "Dimension N ecosystem"
};

const menuButton = document.querySelector(".menu-toggle");
const body = document.body;

const translatableNodes = [];
const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
    const text = node.nodeValue.trim();
    if (!text || !TRANSLATIONS[text] || node.parentElement?.closest("script, style")) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }
});

while (textWalker.nextNode()) {
  const node = textWalker.currentNode;
  translatableNodes.push({ node, es: node.nodeValue, key: node.nodeValue.trim() });
}

const translatableAttributes = [...document.querySelectorAll("[aria-label]")]
  .filter((element) => TRANSLATIONS[element.getAttribute("aria-label")])
  .map((element) => ({ element, es: element.getAttribute("aria-label") }));

function setLanguage(language, persist = true) {
  currentLanguage = language === "en" ? "en" : "es";
  document.documentElement.lang = currentLanguage;

  translatableNodes.forEach(({ node, es, key }) => {
    node.nodeValue = currentLanguage === "en" ? es.replace(key, TRANSLATIONS[key]) : es;
  });

  translatableAttributes.forEach(({ element, es }) => {
    element.setAttribute("aria-label", currentLanguage === "en" ? TRANSLATIONS[es] : es);
  });

  document.querySelectorAll(".language-switcher button").forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.title = currentLanguage === "en"
    ? "Jamagax Studio — Information transformed into matter"
    : "Jamagax Studio — Información convertida en materia";
  document.querySelector('meta[name="description"]')?.setAttribute("content", currentLanguage === "en"
    ? "Jamagax Studio translates patterns, data and intuition into geometries and fabricable systems through computational design, artificial intelligence and digital fabrication."
    : "Jamagax Studio traduce patrones, datos e intuiciones en geometrías y sistemas fabricables mediante diseño computacional, inteligencia artificial y fabricación digital.");

  updateModelCopy(activeModel);
  heroFocusController?.refresh();
  if (persist) {
    localStorage.setItem("jamagax-language", currentLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", currentLanguage);
    history.replaceState(null, "", url);
  }
}

document.querySelectorAll(".language-switcher button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
setLanguage(requestedLanguage || localStorage.getItem("jamagax-language") || "es", false);

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function initHeroFocus() {
  const portal = document.getElementById("hero-3d-portal");
  if (!portal) return;
  const hero = portal.closest(".hero");
  const focusToggle = hero.querySelector(".hero-focus-toggle");
  let focused = false;

  function setFocusMode(enabled) {
    focused = Boolean(enabled);
    hero.classList.toggle("hero-focus-mode", focused);
    body.classList.toggle("hero-focus-mode", focused);
    focusToggle.setAttribute("aria-pressed", String(focused));
    portal.setAttribute("aria-label", currentLanguage === "en"
      ? `3D geometry carousel; click to ${focused ? "restore" : "hide"} the interface`
      : `Carrusel tridimensional de geometrías; pulsa para ${focused ? "recuperar" : "ocultar"} la interfaz`);
  }

  heroFocusController = { refresh: () => setFocusMode(focused) };
  focusToggle.addEventListener("click", () => setFocusMode(!focused));
  hero.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    setFocusMode(!focused);
  });
  portal.addEventListener("keydown", (event) => {
    if (event.target !== portal || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    setFocusMode(!focused);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && focused) setFocusMode(false);
  });
  if (new URLSearchParams(window.location.search).get("focus") === "1") setFocusMode(true);
}

function initHeroCarousel() {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) {
    initHeroFocus();
    return;
  }
  const hero = carousel.closest(".hero");
  const focusToggle = hero.querySelector(".hero-focus-toggle");
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dotsWrap = carousel.querySelector(".hero-dots");
  let active = 0;
  let timer;
  let focused = false;

  function setFocusMode(enabled) {
    focused = Boolean(enabled);
    hero.classList.toggle("hero-focus-mode", focused);
    body.classList.toggle("hero-focus-mode", focused);
    focusToggle.setAttribute("aria-pressed", String(focused));
    carousel.setAttribute("aria-label", currentLanguage === "en"
      ? `Featured projects; click to ${focused ? "restore" : "hide"} the interface`
      : `Proyectos destacados; pulsa para ${focused ? "recuperar" : "ocultar"} la interfaz`);
  }

  heroFocusController = { refresh: () => setFocusMode(focused) };

  focusToggle.addEventListener("click", () => setFocusMode(!focused));
  hero.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    setFocusMode(!focused);
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.target !== carousel || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    setFocusMode(!focused);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && focused) setFocusMode(false);
  });
  if (new URLSearchParams(window.location.search).get("focus") === "1") setFocusMode(true);

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `hero-dot${index === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Ver proyecto ${index + 1}`);
    dot.addEventListener("click", () => show(index, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(index, restart = false) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === active));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    if (restart) start();
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => show(active + 1), 5200);
  }

  carousel.querySelector(".hero-prev").addEventListener("click", () => show(active - 1, true));
  carousel.querySelector(".hero-next").addEventListener("click", () => show(active + 1, true));
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", () => clearInterval(timer));
  carousel.addEventListener("focusout", start);
  start();
}

initHeroCarousel();

function buildModelNavigation() {
  const nav = document.getElementById("model-nav");
  MODELS.forEach((model, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `model-dot${index === 0 ? " active" : ""}`;
    button.setAttribute("aria-label", `Ver ${model.name}`);
    button.addEventListener("click", () => showModel(index));
    nav.appendChild(button);
  });
}

function updateModelCopy(index) {
  const model = MODELS[index];
  document.getElementById("info-type").textContent = model.type[currentLanguage];
  document.getElementById("info-title").textContent = model.name;
  document.getElementById("info-desc").textContent = model.description[currentLanguage];
  document.getElementById("model-counter").textContent = `${String(index + 1).padStart(2, "0")} / ${String(MODELS.length).padStart(2, "0")}`;
  document.querySelectorAll(".model-dot").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}

function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material?.dispose();
  });
}

function styleObject(object) {
  const palette = [0xe9dfcc, 0x9bb9b1, 0xd7c4a5];
  let meshIndex = 0;
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.material = new THREE.MeshStandardMaterial({
      color: palette[meshIndex % palette.length],
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide
    });
    meshIndex += 1;
  });
}

function frameObject(object) {
  const bounds = new THREE.Box3().setFromObject(object);
  const size = bounds.getSize(new THREE.Vector3());
  const largest = Math.max(size.x, size.y, size.z) || 1;
  const scale = 5.4 / largest;
  object.scale.setScalar(scale);

  const scaledBounds = new THREE.Box3().setFromObject(object);
  const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
  object.position.x -= scaledCenter.x;
  object.position.z -= scaledCenter.z;
  object.position.y -= scaledBounds.min.y + 1.65;

  controls.target.set(0, -.35, 0);
  camera.position.set(7.4, 3.8, 8.8);
  camera.near = .1;
  camera.far = 100;
  camera.updateProjectionMatrix();
  controls.update();
}

function showModel(index) {
  if (!window.THREE || !scene) return;
  activeModel = (index + MODELS.length) % MODELS.length;
  const token = ++loadToken;
  const loaderUi = document.getElementById("loading-indicator");
  const loaderLabel = loaderUi?.querySelector("b");
  loaderUi.classList.remove("hidden");
  loaderUi.classList.remove("error");
  if (loaderLabel) loaderLabel.textContent = currentLanguage === "en" ? "Loading geometry · 0%" : "Cargando geometría · 0%";
  updateModelCopy(activeModel);

  new THREE.GLTFLoader().load(
    MODELS[activeModel].source,
    (gltf) => {
      if (token !== loadToken) {
        disposeObject(gltf.scene);
        return;
      }
      if (currentObject) {
        scene.remove(currentObject);
        disposeObject(currentObject);
      }
      currentObject = gltf.scene;
      styleObject(currentObject);
      scene.add(currentObject);
      frameObject(currentObject);
      loaderUi.classList.add("hidden");
    },
    (event) => {
      if (!loaderLabel || !event.total) return;
      const progress = Math.min(99, Math.round((event.loaded / event.total) * 100));
      loaderLabel.textContent = `${currentLanguage === "en" ? "Loading geometry" : "Cargando geometría"} · ${progress}%`;
    },
    (error) => {
      console.error("No fue posible cargar el modelo 3D:", MODELS[activeModel].source, error);
      loaderUi.classList.add("error");
      if (loaderLabel) loaderLabel.textContent = currentLanguage === "en" ? "Geometry unavailable · try another" : "Geometría no disponible · prueba otra";
    }
  );
}

function initGenerativeAudio() {
  const button = document.getElementById("sound-toggle");
  const muteButton = document.getElementById("sound-mute");
  const volumeControl = document.getElementById("sound-volume");
  const flowControl = document.getElementById("sound-flow");
  const pulseControl = document.getElementById("sound-pulse");
  if (!button) return;
  let context;
  let output;
  let filter;
  let lfo;
  let lfoGain;
  let timer;
  let playing = false;
  let muted = false;
  let initialized = false;
  let root;
  let fifth;
  let shimmer;
  const notes = [110, 123.47, 146.83, 164.81, 185, 220];

  const volumeLevel = () => .05 + (Number(volumeControl.value) / 100) * .3;
  const targetLevel = () => playing && !muted ? volumeLevel() : 0;

  const setOutput = (duration = .35) => {
    if (!output || !context) return;
    const now = context.currentTime;
    output.gain.cancelScheduledValues(now);
    output.gain.setValueAtTime(output.gain.value, now);
    output.gain.linearRampToValueAtTime(targetLevel(), now + duration);
  };

  const createVoice = (frequency, type, gainValue, detune = 0) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    gain.gain.value = gainValue;
    oscillator.connect(gain).connect(filter);
    oscillator.start();
    return { oscillator, gain };
  };

  const start = async () => {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) {
      button.querySelector("span").textContent = "Audio N/A";
      return;
    }
    context ||= new AudioEngine();
    await context.resume();
    if (initialized) {
      setOutput(1.2);
      scheduleEvolution();
      return;
    }
    initialized = true;
    output = context.createGain();
    filter = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();
    filter.type = "lowpass";
    filter.frequency.value = 1250;
    filter.Q.value = .7;
    compressor.threshold.value = -18;
    compressor.knee.value = 16;
    compressor.ratio.value = 4;
    output.gain.value = 0;
    filter.connect(compressor).connect(output).connect(context.destination);

    root = createVoice(55, "sine", .52);
    fifth = createVoice(82.41, "triangle", .22, -4);
    shimmer = createVoice(220, "sine", .075, 7);
    lfo = context.createOscillator();
    lfoGain = context.createGain();
    lfo.frequency.value = .08;
    lfoGain.gain.value = 380;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    setOutput(1.1);
    scheduleEvolution();
  };

  const scheduleEvolution = () => {
    clearInterval(timer);
    timer = window.setInterval(() => {
      const now = context.currentTime;
      const next = notes[Math.floor(Math.random() * notes.length)];
      shimmer.oscillator.frequency.exponentialRampToValueAtTime(next, now + 4);
      fifth.oscillator.detune.linearRampToValueAtTime((Math.random() - .5) * 12, now + 5);
      root.gain.gain.linearRampToValueAtTime(.25 + Math.random() * .12, now + 6);
    }, 8500 - Number(flowControl.value) * 55);
  };

  const stop = () => {
    clearInterval(timer);
    setOutput(.8);
  };

  const setPlaying = async (nextPlaying) => {
    playing = nextPlaying;
    button.classList.toggle("active", playing);
    document.getElementById("sound-console")?.classList.toggle("active", playing);
    button.setAttribute("aria-pressed", String(playing));
    button.querySelector("span").textContent = playing ? "PsyChill ON" : "PsyChill";
    if (playing) await start();
    else stop();
  };

  button.addEventListener("click", async () => {
    await setPlaying(!playing);
  });

  muteButton?.addEventListener("click", async () => {
    if (!initialized) await setPlaying(true);
    muted = !muted;
    muteButton.classList.toggle("active", muted);
    muteButton.setAttribute("aria-pressed", String(muted));
    muteButton.textContent = muted ? "Muted" : "Mute";
    setOutput(.25);
  });

  volumeControl?.addEventListener("input", () => setOutput(.08));
  flowControl?.addEventListener("input", () => {
    if (playing) scheduleEvolution();
  });
  pulseControl?.addEventListener("input", () => {
    if (!lfo || !context) return;
    lfo.frequency.setTargetAtTime(.025 + Number(pulseControl.value) * .003, context.currentTime, .25);
    lfoGain.gain.setTargetAtTime(180 + Number(pulseControl.value) * 6, context.currentTime, .3);
  });

  const beginOnFirstGesture = async (event) => {
    if (event.target.closest("#sound-toggle")) return;
    await setPlaying(true);
  };
  document.addEventListener("pointerdown", beginOnFirstGesture, { once: true });
}

function initViewer() {
  if (!window.THREE) {
    document.getElementById("loading-indicator")?.classList.add("hidden");
    return;
  }

  const canvas = document.getElementById("three-canvas");
  const wrapper = canvas.parentElement;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, wrapper.clientWidth / wrapper.clientHeight, .1, 100);
  camera.position.set(7.4, 3.8, 8.8);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = .055;
  controls.autoRotate = true;
  controls.autoRotateSpeed = .38;
  controls.minDistance = 4;
  controls.maxDistance = 22;
  controls.maxPolarAngle = Math.PI * .56;

  scene.add(new THREE.HemisphereLight(0xd8f6f1, 0x10212a, 1.55));
  const key = new THREE.DirectionalLight(0xfff4df, 2.3);
  key.position.set(6, 9, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x45d9d1, 1.1);
  rim.position.set(-7, 3, -5);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(7, 64),
    new THREE.ShadowMaterial({ color: 0x00121e, opacity: .28 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.66;
  ground.receiveShadow = true;
  scene.add(ground);

  const loop = () => {
    requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  };
  loop();

  resizeObserver = new ResizeObserver(() => {
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });
  resizeObserver.observe(wrapper);

  showModel(0);
}

document.getElementById("model-prev")?.addEventListener("click", () => showModel(activeModel - 1));
document.getElementById("model-next")?.addEventListener("click", () => showModel(activeModel + 1));
buildModelNavigation();
const viewer = document.querySelector(".viewer-wrap");
const viewerObserver = new IntersectionObserver((entries, observer) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  initViewer();
  observer.disconnect();
}, { rootMargin: "500px 0px" });
viewerObserver.observe(viewer);
initGenerativeAudio();
