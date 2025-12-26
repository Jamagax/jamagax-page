/**
 * Jamagax | Ultimate Quantum Journey
 * Shaders, Particles, and Advanced Interactivity
 */

let container, scene, camera, renderer, clock, raycaster, mouse;
let mainGroup;
let scrollY = window.scrollY;
let targetScrollY = 0;
let isAudioActive = false;
let audioContext, analyser, dataArray;

const sectionMeshes = [];
const PARAMS = {
    colors: {
        cyan: 0x00f2ff,
        magenta: 0xff00e5,
        purple: 0x7d00ff,
        gold: 0xffca28
    },
    distanceBetweenSections: 14,
    particleCount: 8000
};

// SHADER DEFINITIONS
const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float iTime;
    uniform vec3 iColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        float pulse = sin(vPosition.y * 5.0 + iTime * 2.0) * 0.5 + 0.5;
        gl_FragColor = vec4(iColor, pulse * 0.4);
    }
`;

function init() {
    container = document.getElementById('hero-canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    createAdvancedJourney();
    setupInteractions();
    animate();
}

function createAdvancedJourney() {
    const sectionData = [
        { type: 'core', color: PARAMS.colors.cyan, id: 'home' },
        { type: 'torus', color: PARAMS.colors.magenta, id: 'studio' },
        { type: 'octa', color: PARAMS.colors.gold, id: 'dimension-n' },
        { type: 'tetra', color: PARAMS.colors.purple, id: 'philosophy' },
        { type: 'icosa', color: PARAMS.colors.cyan, id: 'musica' },
        { type: 'dodeca', color: PARAMS.colors.cyan, id: 'enciclopedia' },
        { type: 'box', color: PARAMS.colors.purple, id: 'lab' },
        { type: 'lattice', color: PARAMS.colors.gold, id: 'lattice-agent' },
        { type: 'points', color: PARAMS.colors.cyan, id: 'repos' }
    ];

    sectionData.forEach((data, i) => {
        const group = new THREE.Group();
        group.position.y = -i * PARAMS.distanceBetweenSections;
        group.position.x = window.innerWidth > 968 ? 3 : 0;
        group.userData = { sectionId: data.id };

        const shaderMat = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iColor: { value: new THREE.Color(data.color) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            wireframe: true
        });

        let mesh;
        switch (data.type) {
            case 'core': mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 2), shaderMat); break;
            case 'torus': mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.4, 120, 20), shaderMat); break;
            case 'octa': mesh = new THREE.Mesh(new THREE.OctahedronGeometry(2), shaderMat); break;
            case 'tetra': mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(2.5), shaderMat); break;
            case 'icosa': mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2), shaderMat); break;
            case 'dodeca': mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(2), shaderMat); break;
            case 'box': mesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), shaderMat); break;
            case 'lattice':
                mesh = createLatticeGrid(2, 4, data.color);
                break;
            case 'points': mesh = new THREE.Mesh(new THREE.SphereGeometry(2, 6, 6), shaderMat); break;
        }

        group.add(mesh);
        sectionMeshes.push({ mesh, material: shaderMat || mesh.material });
        mainGroup.add(group);
    });

    createNebula();
}

function createLatticeGrid(size, divisions, color) {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
    const step = size / divisions;

    for (let i = -size / 2; i <= size / 2; i += step) {
        for (let j = -size / 2; j <= size / 2; j += step) {
            // Lines along X
            const geoX = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-size / 2, i, j),
                new THREE.Vector3(size / 2, i, j)
            ]);
            group.add(new THREE.Line(geoX, material));

            // Lines along Y
            const geoY = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, -size / 2, j),
                new THREE.Vector3(i, size / 2, j)
            ]);
            group.add(new THREE.Line(geoY, material));

            // Lines along Z
            const geoZ = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, j, -size / 2),
                new THREE.Vector3(i, j, size / 2)
            ]);
            group.add(new THREE.Line(geoZ, material));
        }
    }
    return group;
}

// AGENT LOGIC
let voteCount = { estable: 0, critico: 0 };

function vote(type) {
    voteCount[type]++;
    const stats = document.getElementById('vote-stats');
    stats.innerText = `Registros: [Estable: ${voteCount.estable} | Crítico: ${voteCount.critico}]`;

    // Save locally
    localStorage.setItem('quantum_votes', JSON.stringify(voteCount));
}

function captureLead(event) {
    event.preventDefault();
    const email = document.getElementById('lead-email').value;
    const interest = document.getElementById('lead-interest').value;
    const successMsg = document.getElementById('lead-success');

    console.log(`Lead Captured: Email=${email}, Interest=${interest}`);

    // Simulate API call
    successMsg.classList.remove('hidden');
    document.getElementById('lead-form').style.display = 'none';

    // Store interest for personalized UI later
    localStorage.setItem('user_interest', interest);
}

function mutateLattice() {
    const input = document.getElementById('agent-input').value.toLowerCase();
    const response = document.getElementById('agent-response');
    const latticeMesh = sectionMeshes.find(m => m.mesh.type === 'Group' && m.mesh.children.length > 50);

    if (!input) return;

    response.innerText = "Analizando topología...";

    // Automatically select interest based on input
    if (input.includes('octet')) document.getElementById('lead-interest').value = 'lattice';

    // REFERENCE: Geometrica Encyclopedia (Onyx & Paper White)
    const concepts = ["Parametría", "Morfogénesis", "Dualidad", "Topología", "Simbiosis"];

    setTimeout(() => {
        if (input.includes('octet') || input.includes('complex')) {
            response.innerText = `Agente: Estructura Octet detectada. Vinculando con concepto de ${concepts[1]} (Chapter 1). Optimizando distribución de carga...`;
            if (latticeMesh) latticeMesh.mesh.scale.set(1.5, 0.5, 1.5);
        } else if (input.includes('cube') || input.includes('basic')) {
            response.innerText = `Agente: Re-configurando a Lattice Cúbico Estándar. Principio de ${concepts[0]} aplicado.`;
            if (latticeMesh) latticeMesh.mesh.scale.set(1, 1, 1);
        } else if (input.includes('collapse')) {
            response.innerText = `Agente: Colapso topológico iniciado. Singularidad de ${concepts[2]} inminente.`;
            if (latticeMesh) latticeMesh.mesh.scale.set(0.1, 0.1, 0.1);
        } else if (input.includes('geometrica') || input.includes('encyclopedia')) {
            response.innerText = `Agente: Accediendo a archivos de la Enciclopedia Geométrica (Vol 0.1). Cargando 23 conceptos de diseño computacional...`;
            // Change color to Geometrica Accent (#E8B4B8)
            if (latticeMesh) {
                latticeMesh.mesh.children.forEach(line => line.material.color.set(0xE8B4B8));
            }
        } else {
            response.innerText = `Agente: Comando '${input}' no reconocido en el espacio de Hilbert local. ¿Quizás buscas 'Parametría'?`;
        }
    }, 800);
}

// Load previous stats
window.addEventListener('DOMContentLoaded', () => {
    const savedVotes = localStorage.getItem('quantum_votes');
    if (savedVotes) {
        voteCount = JSON.parse(savedVotes);
        const stats = document.getElementById('vote-stats');
        if (stats) stats.innerText = `Registros: [Estable: ${voteCount.estable} | Crítico: ${voteCount.critico}]`;
    }
});

function createNebula() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARAMS.particleCount * 3);
    for (let i = 0; i < PARAMS.particleCount * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 25;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
        size: 0.015,
        color: PARAMS.colors.cyan,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);
}

function setupInteractions() {
    window.addEventListener('scroll', () => { targetScrollY = window.scrollY; });
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
}

function onClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(mainGroup.children, true);
    if (intersects.length > 0) {
        const sectionId = intersects[0].object.parent.userData.sectionId;
        if (sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjust position for mobile
    mainGroup.children.forEach(group => {
        group.position.x = window.innerWidth > 968 ? 3 : 0;
    });
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Smooth Scroll
    scrollY += (targetScrollY - scrollY) * 0.08;
    const progress = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
    mainGroup.position.y = progress * (sectionMeshes.length - 1) * PARAMS.distanceBetweenSections;

    // Advanced Animations & Shaders
    sectionMeshes.forEach((item, i) => {
        item.material.uniforms.iTime.value = time;
        item.mesh.rotation.y = time * 0.3 + i;
        item.mesh.rotation.z = time * 0.2;

        // Audio reactivity simulation if not active, or real if active
        let scaleBoost = 0;
        if (analyser) {
            analyser.getByteFrequencyData(dataArray);
            scaleBoost = dataArray[10] / 255 * 0.5;
        } else {
            scaleBoost = Math.sin(time * 3 + i) * 0.05;
        }
        item.mesh.scale.setScalar(1 + scaleBoost);
    });

    // Parallax
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

// Optional Audio Start
function toggleAudio() {
    const status = document.getElementById('audio-status');
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        status.innerText = "ACTIVE";
        status.parentElement.style.borderColor = "#00f2ff";
        status.parentElement.style.color = "#00f2ff";
    } else {
        // Toggle logic (mute/unmute) could go here
        status.innerText = audioContext.state === 'running' ? "MUTED" : "ACTIVE";
        audioContext.state === 'running' ? audioContext.suspend() : audioContext.resume();
    }
}

window.onload = init;
