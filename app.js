const MODELS = [
  {
    name: "Templo de Morfeo",
    type: { es: "Arquitectura paramétrica", en: "Parametric architecture" },
    description: { es: "Una investigación espacial de arcos continuos, bóvedas fluidas y luz tropical.", en: "A spatial exploration of continuous arches, fluid vaults and tropical light." },
    source: "jamagax_models/TemploDeMorfeo.glb"
  },
  {
    name: "Escultura Polyhedra",
    type: { es: "Geometría espacial", en: "Spatial geometry" },
    description: { es: "Simetría icosaédrica, estelaciones y detalle recursivo convertidos en una pieza escultórica.", en: "Icosahedral symmetry, stellations and recursive detail transformed into a sculptural piece." },
    source: "jamagax_models/Escultura_Polyhedra.glb"
  },
  {
    name: "A-Frame",
    type: { es: "Sistema constructivo", en: "Building system" },
    description: { es: "Una estructura modular que usa repetición, triangulación y ensamblaje como lenguaje.", en: "A modular structure that uses repetition, triangulation and assembly as its language." },
    source: "jamagax_models/A-Frame.glb"
  },
  {
    name: "M-Size Shell",
    type: { es: "Fabricación aditiva", en: "Additive manufacturing" },
    description: { es: "Superficie de doble curvatura racionalizada para ventilación, ligereza e impresión 3D.", en: "A double-curved surface rationalized for ventilation, lightness and 3D printing." },
    source: "jamagax_models/M-Size.glb"
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
  "Diseño computacional, modelado orgánico/paramétrico y desarrollo con inteligencia artificial.": "Computational design, organic/parametric modeling and artificial intelligence development.",
  "Explorar el estudio": "Explore the studio",
  "Cuéntanos tu idea": "Tell us your idea",
  "Proyectos destacados": "Featured projects",
  "Diseño paramétrico": "Parametric design",
  "Código · Forma · Materia": "Code · Form · Matter",
  "Diseño computacional": "Computational design",
  "El estudio": "The studio",
  "Hacemos visible lo que": "We make visible what",
  "todavía no existe.": "does not yet exist.",
  "Jamagax Studio es el laboratorio creativo de": "Jamagax Studio is the creative laboratory of",
  ". Cerramos la brecha entre el diseño algorítmico y la manufactura industrial: del primer trazo al archivo que entiende la máquina.": ". We bridge algorithmic design and industrial manufacturing—from the first sketch to a file the machine can understand.",
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
  "Casos seleccionados": "Selected work",
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
  "Archivo interactivo": "Interactive archive",
  "Geometrías en proceso": "Geometries in progress",
  "Explora los modelos: arrastra para rotar y usa la rueda para acercarte.": "Explore the models: drag to rotate and use the wheel to zoom.",
  "Archivo digital": "Digital archive",
  "Cargando geometría": "Loading geometry",
  "Capacidades": "Capabilities",
  "Del concepto": "From concept",
  "a la materia.": "to matter.",
  "Nos integramos donde el proyecto necesita pensamiento geométrico, visualización rigurosa o una ruta clara de fabricación.": "We join projects wherever they need geometric thinking, rigorous visualization or a clear path to fabrication.",
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
  "Continuidad, coherencia y transformación como principios para diseñar sistemas vivos.": "Continuity, coherence and transformation as principles for designing living systems.",
  "Cómo trabajamos": "How we work",
  "Un proceso": "A process",
  "sin cajas negras.": "without black boxes.",
  "Cada decisión queda conectada con una intención. El cliente participa, entiende y puede elegir.": "Every decision remains connected to an intention. The client participates, understands and can choose.",
  "Concepto y forma": "Concept and form",
  "Definimos el ADN geométrico, las fuerzas y los criterios del proyecto.": "We define the project’s geometric DNA, forces and criteria.",
  "Lógica algorítmica": "Algorithmic logic",
  "Construimos un sistema paramétrico para iterar con velocidad y control.": "We build a parametric system for fast, controlled iteration.",
  "Racionalización y DfM": "Rationalization and DfM",
  "Paneles, uniones, tolerancias y secuencias se validan antes de fabricar.": "Panels, joints, tolerances and sequences are validated before fabrication.",
  "Directo a máquina": "Direct to machine",
  "Entregamos G-code, DXF anidados, robot paths o archivos de impresión listos.": "We deliver production-ready G-code, nested DXFs, robot paths or print files.",
  "Diseño computacional · DfM · consultoría técnica": "Computational design · DfM · technical consulting",
  "¿Tienes una geometría difícil,": "Do you have a difficult geometry,",
  "una idea ambiciosa o ambas?": "an ambitious idea—or both?",
  "Hagámosla": "Let’s make it",
  "posible.": "possible.",
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
    ? "Jamagax Studio — Computational design from Tulum"
    : "Jamagax Studio — Diseño computacional desde Tulum";
  document.querySelector('meta[name="description"]')?.setAttribute("content", currentLanguage === "en"
    ? "Jamagax Studio transforms complex geometries into buildable systems through computational design, CNC, 3D printing, reality capture and AI."
    : "Jamagax Studio transforma geometrías complejas en sistemas fabricables mediante diseño computacional, CNC, impresión 3D, captura de realidad e IA.");

  updateModelCopy(activeModel);
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

function initHeroCarousel() {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dotsWrap = carousel.querySelector(".hero-dots");
  let active = 0;
  let timer;

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
  loaderUi.classList.remove("hidden");
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
    undefined,
    () => loaderUi.classList.add("hidden")
  );
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
