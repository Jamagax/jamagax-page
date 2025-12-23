// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// --- THREE.JS IMPLEMENTATION ---
// Inspired by "Three.js Journey" - Particles & Geometry

const initThreeJS = () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance opt
    container.innerHTML = ''; // Clear existing
    container.appendChild(renderer.domElement);

    // Objects
    // 1. Central Complex Form (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.2, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 2. Surrounding Particles (The "Galaxy" feel)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles in a sphere around the center
        posArray[i] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Custom material for particles (glowy dots)
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xff00ff, // Magenta accent
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Inner Geometry (Torus text or knot)
    const torusGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);


    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Clock
    const clock = new THREE.Clock();

    // Animation Loop
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Rotate Objects
        sphere.rotation.y = 0.5 * elapsedTime;
        sphere.rotation.x = 0.2 * elapsedTime;

        torus.rotation.y = -0.3 * elapsedTime;
        torus.rotation.x = -0.2 * elapsedTime;

        // Particle subtle rotation
        particlesMesh.rotation.y = 0.05 * elapsedTime;
        particlesMesh.rotation.x = mouseY * 0.00005; // very subtle reaction

        // Mouse Parallax easing
        // sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y); // Creates a drag effect, might break continuous rotation
        // Instead, let's just move the camera slightly or rotate the group

        // Gentle camera sway
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    // Resize handling
    window.addEventListener('resize', () => {
        // Update setup
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};

// Initialize once DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initThreeJS, 100); // Small delay to ensure container layout is settled
} else {
    document.addEventListener('DOMContentLoaded', initThreeJS);
}

console.log("Jamagax System Online. Three.js Engine Ignited.");
