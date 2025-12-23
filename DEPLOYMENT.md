# Guía de Despliegue (Launch Guide) - Jamagax Page

Tu sitio es estático (HTML/CSS/JS), por lo que es muy fácil de lanzar gratis y rápido.

## Opción 1: Vercel (Recomendada - Más rápida)
Es ideal para proyectos modernos.
1.  Abre tu terminal en esta carpeta.
2.  Ejecuta: `npx vercel`
3.  Sigue las instrucciones (Login -> Yes to all -> Deploy).
4.  Te dará una URL tipo `jamagax-page.vercel.app`.
5.  Luego puedes configurar tu dominio `dimensionn.xyz` en el panel de Vercel.

## Opción 2: GitHub Pages
Si quieres hospedarlo en GitHub.
1.  Crea un repositorio en GitHub.com (ej. `jamagax-hub`).
2.  Ejecuta estos comandos en la terminal:
    ```bash
    git init
    git add .
    git commit -m "Initial Launch"
    git branch -M main
    git remote add origin https://github.com/TU_USUARIO/jamagax-hub.git
    git push -u origin main
    ```
3.  Ve a `Settings > Pages` en GitHub y actívalo.

## Opción 3: Hosting Tradicional (FTP)
Si ya tienes hosting para `dimensionn.xyz`:
1.  Usa un cliente FTP (como FileZilla).
2.  Sube todos los archivos (`index.html`, `style.css`, `script.js`) a la carpeta `public_html` de tu servidor.
