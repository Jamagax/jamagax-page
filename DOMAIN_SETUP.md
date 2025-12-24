# 📦 Deploy Jamagax Landing Page on Hostinger

## Overview
You have the static site **Jamagax Dimensional Hub** ready in the folder `C:\Jamagax-Page`. This guide shows how to publish it on **Hostinger** and bind the custom sub‑domain `www.jamagax.dimensionn.xyz` (or `jamagax.dimensionn.xyz`) to the site.

---

## 1️⃣ Prerequisites
| Item | Why you need it |
|------|-----------------|
| Hostinger account with an active hosting plan | Provides the web server and DNS management. |
| Access to the **File Manager** or **FTP** credentials (host, user, password) | To upload the site files. |
| Domain `dimensionn.xyz` registered (you already have the sub‑domain `jamagax.dimensionn.xyz`). |
| Optional: **GitHub repository** `https://github.com/Jamagax/jamagax-page` (already set up). |

---

## 2️⃣ Upload the site files
You have two simple options:

### Option A – Hostinger File Manager (quickest)
1. Log in to the Hostinger **hPanel**.
2. Navigate to **Files → File Manager**.
3. Open the **public_html** (or the folder you set as the document root for the sub‑domain).
4. Click **Upload** → **Select Files** and choose **all files** from `C:\Jamagax-Page` (including `index.html`, `style.css`, `script.js`, `assets/` if any, etc.).
5. After upload, verify that the file tree mirrors the local structure.

### Option B – FTP (FileZilla) – good for future updates
1. In the Hostinger hPanel go to **Files → FTP Accounts** → **Create FTP Account** (if you don’t have one).
2. Note the **Host**, **Username**, **Password**, and **Port** (usually 21).
3. Open **FileZilla** (or any FTP client).
4. Fill in the connection details and click **Quickconnect**.
5. In the **Remote site** pane navigate to the folder that will serve the sub‑domain (e.g. `public_html/jamagax`).
6. Drag‑and‑drop the entire content of `C:\Jamagax-Page` from the **Local site** pane to the remote folder.
7. Wait until the transfer finishes (you’ll see a green check for each file).

---

## 3️⃣ Configure the sub‑domain in Hostinger
1. In hPanel go to **Domains → Sub‑domains**.
2. Create a sub‑domain:
   - **Sub‑domain**: `jamagax` (or `www` if you prefer `www.jamagax.dimensionn.xyz`).
   - **Domain**: `dimensionn.xyz`.
   - **Root Directory**: set it to the folder where you uploaded the site (e.g. `public_html/jamagax`).
3. Click **Create**.
4. Hostinger will automatically add a DNS **A‑record** pointing the sub‑domain to the server IP. If you manage DNS elsewhere, add an **A‑record** for `jamagax` pointing to the IP shown in the Hostinger dashboard.

---

## 4️⃣ Enable SSL (HTTPS)
1. Still in hPanel, go to **SSL → Manage SSL**.
2. Find the entry for `jamagax.dimensionn.xyz` and click **Install** (Hostinger provides a free **Let’s Encrypt** certificate).
3. After installation, enable **Force HTTPS** (usually a toggle next to the SSL status). This will automatically redirect HTTP → HTTPS.

---

## 5️⃣ Optional: Add a `.htaccess` for clean URLs & HTTPS fallback
Create a file named `.htaccess` in the root of the uploaded site (same folder as `index.html`).
```apache
# Force HTTPS (in case the hoster toggle fails)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent directory listing
Options -Indexes
```
Upload this file via the File Manager or FTP.

---

## 6️⃣ Verify the deployment
Open a browser and navigate to:
```
https://jamagax.dimensionn.xyz/
```
You should see the same landing page you previewed locally (hero section, project cards, GitHub repo list, etc.).

If you see a **404** or a blank page:
- Double‑check that the **document root** matches the folder containing `index.html`.
- Ensure the **DNS** has propagated (use `nslookup jamagax.dimensionn.xyz` to see the IP).
- Verify that the **SSL** is active (the padlock icon should appear).

---

## 7️⃣ Automate future updates (GitHub → Hostinger via FTP)
If you want to push changes from GitHub automatically:
1. Create a **GitHub secret** named `HOSTINGER_FTP_PASSWORD` with your FTP password.
2. Add the following workflow file to your repo (`.github/workflows/deploy-hostinger.yml`):
```yaml
name: Deploy to Hostinger via FTP
on:
  push:
    branches: [main]

jobs:
  ftp-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: your-hostinger-ftp-host.com   # e.g. ftp.hostinger.com
          username: your-ftp-username
          password: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
          local-dir: ./
          server-dir: /public_html/jamagax   # adjust if you use a different folder
```
3. Commit the workflow (`git add .github/workflows/deploy-hostinger.yml && git commit -m "Add Hostinger FTP deploy workflow" && git push`).
4. Every push to `main` will now upload the latest files to Hostinger automatically.

---

## 8️⃣ Quick checklist (copy‑paste for your notes)
```
[ ] Upload all site files to Hostinger (File Manager or FTP)
[ ] Create sub‑domain `jamagax.dimensionn.xyz` → root folder
[ ] Add A‑record (if DNS managed elsewhere) → Hostinger IP
[ ] Install Let’s Encrypt SSL & enable Force HTTPS
[ ] (Optional) Add .htaccess for HTTPS redirect & security
[ ] Verify https://jamagax.dimensionn.xyz loads correctly
[ ] (Optional) Set up GitHub → Hostinger FTP CI workflow
```

---

### 🎉 All set!
Follow the steps above and your Jamagax landing page will be live on your Hostinger‑hosted domain, fully secured with HTTPS and ready for future automated updates.

If you run into any specific error (e.g., DNS not propagating, FTP connection refused, 500 internal error), let me know the exact message and I’ll help troubleshoot.
