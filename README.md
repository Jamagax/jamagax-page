# Jamagax Studio

Sitio oficial de Jamagax Studio, el laboratorio de diseño computacional del ecosistema Dimension N.

Publicación: [jamagax.dimensionn.xyz](https://jamagax.dimensionn.xyz)

## Dirección visual

La interfaz combina una base editorial marfil con azul océano, turquesa y coral. Las líneas paramétricas, la geometría orbital y el visor de modelos 3D conectan la identidad de Jamagax con arquitectura orgánica, tecnología y naturaleza tropical.

## Estructura

- `index.html`: contenido, navegación, SEO y semántica.
- `style.css`: sistema visual y diseño adaptable.
- `app.js`: navegación móvil, animaciones y galería Three.js.
- `jamagax_models/`: modelos GLB del portafolio.
- `assets/projects/`: fotografías extraídas del portafolio maestro 2026.
- `assets/downloads/`: CV en español, CV en inglés y portafolio descargable.
- `assets/javier-cnc.jpg`: retrato de Javier Martínez Gaxiola en el taller CNC.
- `dist/`: build listo para publicación; se genera con `BUILD_DIST.bat`.

## Desarrollo local

Ejecuta `LAUNCH_LOCAL_SERVER.bat` o, desde PowerShell:

```powershell
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Build

```powershell
cmd /c BUILD_DIST.bat
```

El sitio es HTML, CSS y JavaScript estático. Three.js, OrbitControls y GLTFLoader se sirven desde CDN; si no están disponibles, el diseño mantiene una composición visual de respaldo.

## Publicación

La carpeta `dist/` contiene únicamente los archivos públicos. El despliegue FTP existente usa las variables de entorno `FTP_HOST`, `FTP_USER` y `FTP_PASS`; consulta `INSTRUCCIONES_FTP.md` antes de publicar.
