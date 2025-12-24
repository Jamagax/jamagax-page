# 🚀 Archivos para el FTP (Hostinger)

He optimizado y preparado la carpeta `dist` con **únicamente los archivos necesarios** para que tu web funcione perfectamente en Hostinger. 

### 📂 Carpeta a subir: `C:\Jamagax-Page\dist`

Solo tienes que copiar el **contenido** de la carpeta `dist` a tu directorio `public_html/jamagax/` (o donde prefieras):

1.  **`index.html`** (Estructura y SEO)
2.  **`style.css`** (Diseño Quantum)
3.  **`script.js`** (Three.js Journey Logic)
4.  **`assets/`** (Contiene tu `logo.png`)

---

### 🛠️ ¿Por qué esta optimización?
He filtrado los archivos de desarrollo para que tu servidor sea más ligero y seguro:
- ❌ **Sin scripts locales**: Se eliminó `LAUNCH_LOCAL.bat` y `auto_cleanup.sh`.
- ❌ **Sin configuración de Git**: Se excluyeron `.gitignore` y carpetas `.github`.
- ❌ **Sin archivos internos**: Se eliminaron los borradores de documentación y logs internos.

### 💡 Tip de experto:
Si alguna vez quieres automatizar esto totalmente para no tener que copiar archivos a mano, recuerda que el archivo que te creé en `.github/workflows/deploy-hostinger.yml` lo hará solo cada vez que hagas un cambio, siempre y cuando pongas tus claves FTP en los Secrets de GitHub.

¡Listo para el despegue! 🚀🌀
