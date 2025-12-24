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
        { type: 'dodeca', color: PARAMS.colors.cyan, id: 'enciclopedia' },
        { type: 'box', color: PARAMS.colors.purple, id: 'lab' },
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
            case 'dodeca': mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(2), shaderMat); break;
            case 'box': mesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), shaderMat); break;
            case 'points': mesh = new THREE.Mesh(new THREE.SphereGeometry(2, 6, 6), shaderMat); break;
        }

        group.add(mesh);
        sectionMeshes.push({ mesh, material: shaderMat });
        mainGroup.add(group);
    });

    createNebula();
}

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
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        // Map to mic or internal audio here if needed
    }
}

window.onload = init;
