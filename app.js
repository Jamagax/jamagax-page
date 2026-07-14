const MODELS = [
  {
    name: "Templo de Morfeo",
    type: "Arquitectura paramétrica",
    description: "Una investigación espacial de arcos continuos, bóvedas fluidas y luz tropical.",
    source: "jamagax_models/TemploDeMorfeo.glb"
  },
  {
    name: "Escultura Polyhedra",
    type: "Geometría espacial",
    description: "Simetría icosaédrica, estelaciones y detalle recursivo convertidos en una pieza escultórica.",
    source: "jamagax_models/Escultura_Polyhedra.glb"
  },
  {
    name: "A-Frame",
    type: "Sistema constructivo",
    description: "Una estructura modular que usa repetición, triangulación y ensamblaje como lenguaje.",
    source: "jamagax_models/A-Frame.glb"
  },
  {
    name: "M-Size Shell",
    type: "Fabricación aditiva",
    description: "Superficie de doble curvatura racionalizada para ventilación, ligereza e impresión 3D.",
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

const menuButton = document.querySelector(".menu-toggle");
const body = document.body;

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
  document.getElementById("info-type").textContent = model.type;
  document.getElementById("info-title").textContent = model.name;
  document.getElementById("info-desc").textContent = model.description;
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
