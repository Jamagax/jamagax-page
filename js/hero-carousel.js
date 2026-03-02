/**
 * JAMAGAX // HERO 3D CAROUSEL
 * Three.js based interactive carousel for the main universes.
 */

class HeroCarousel {
    constructor() {
        this.container = document.getElementById('hero-canvas-container');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.items = [
            { title: "DIMENSION N", img: "assets/dimension_n.png", link: "#dimension-n" },
            { title: "LAB", img: "assets/3d_kin_lab.png", link: "#jamagaiax" },
            { title: "PHILOSOPHY", img: "assets/philosophy_flow.png", link: "#philosophy" },
            { title: "GEOMETRY", img: "assets/geometrica.png", link: "#enciclopedia" },
            { title: "MUSIC", img: "assets/noni_bg.png", link: "#musica" }
        ];

        this.cards = [];
        this.radius = 12;
        this.rotationY = 0;
        this.targetRotationY = 0;
        this.isDragging = false;
        this.previousMouseX = 0;

        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 24;
        this.camera.position.y = 4;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f2ff, 1.5);
        pointLight.position.set(0, 10, 10);
        this.scene.add(pointLight);

        // Load textures and create cards
        const loader = new THREE.TextureLoader();

        this.items.forEach((item, index) => {
            const geometry = new THREE.PlaneGeometry(8, 10);
            const texture = loader.load(item.img);
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            });

            const card = new THREE.Mesh(geometry, material);

            // Initial positioning in a circle
            const angle = (index / this.items.length) * Math.PI * 2;
            card.position.x = Math.sin(angle) * this.radius;
            card.position.z = Math.cos(angle) * this.radius;
            card.rotation.y = angle;

            // Add border/edge effect
            const edgeGeo = new THREE.EdgesGeometry(geometry);
            const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f2ff });
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            card.add(edges);

            this.scene.add(card);

            // Create a small label mesh or use simpler text
            // For now, we'll focus on the visual card, but we could add 3D text here if needed.
            // Let's at least add a glow background to the active card

            this.cards.push({ mesh: card, angle: angle, title: item.title });
        });

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('touchstart', (e) => this.onMouseDown(e.touches[0]));
        window.addEventListener('touchmove', (e) => this.onMouseMove(e.touches[0]));
        window.addEventListener('touchend', () => this.onMouseUp());

        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.previousMouseX = e.clientX;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.previousMouseX;
        this.targetRotationY += deltaX * 0.005;
        this.previousMouseX = e.clientX;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth rotation
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.05;

        // Auto-rotation when not dragging
        if (!this.isDragging) {
            this.targetRotationY += 0.001;
        }

        this.cards.forEach((cardObj) => {
            const currentAngle = cardObj.angle + this.rotationY;
            cardObj.mesh.position.x = Math.sin(currentAngle) * this.radius;
            cardObj.mesh.position.z = Math.cos(currentAngle) * this.radius;
            cardObj.mesh.rotation.y = currentAngle;

            // Adjust opacity based on distance
            const distance = cardObj.mesh.position.z;
            const opacity = THREE.MathUtils.mapLinear(distance, -this.radius, this.radius, 0.2, 1);
            cardObj.mesh.material.opacity = opacity;

            // Scale based on distance
            const scale = THREE.MathUtils.mapLinear(distance, -this.radius, this.radius, 0.6, 1.1);
            cardObj.mesh.scale.set(scale, scale, 1);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
});
