# Welcome to 76 Style Custom Booking

<!-- # <img src="https://www.tunai.io/images/logo2.png" width="50"> JulyTech Sdn Bhd -->

<div style="display: flex; align-items: center; gap: 12px;">
  <img src="https://www.tunai.io/images/logo2.png" width="50" />
  <span style="font-style:bold">JulyTech Sdn Bhd</span>
  <img src="https://www.tunai.io/images/logo2.png" width="50" />
</div>

## A Booking Web Application in Sync with Tunai Pro App

App Name : Tunai Web (Service Booking App)

All Right Reserved : JulyTech Sdn Bhd

Development Team :

- Ikhmal Hidayat (Software Engineer : Oct 2025 - Present)

Designed By :

- Ikhmal Hidayat (Software Engineer : Oct 2025 - Present)

Web URL : http://web.tunai.io

---

### Directory

1. [Tools and Hardware Requrements Declaration](#tools-and-hardware-requirements-declaration)

2. [Project Technical Specification](#project-technical-specifications)

3. [Develepoment Preview](#development-preview)

4. [Deploying to Production](#deploying-to-production)

5. [Project Struncture](#project-structure)

---

### Tools and Hardware Requirements Declaration

**I) Software Requirements**

1. **macOS (Ventura or later recommended)**
2. **Node.js (LTS version: 18.x or 20.x)**
3. **npm** (package manager)
4. **Nuxt 4 Framework**
5. **TypeScript**
6. **Vite**
7. **IDE (Recommended: Visual Studio Code)**
   - Vue Language Tools
   - ESLint
   - Prettier
8. **Git**

**II) Hardware Requirements**

1. **Apple MacBook (Intel or Apple Silicon)**
2. **Minimum 8 GB RAM**
3. **Minimum 10 GB free disk space**
4. **Stable Internet / WiFi availability**

---

### Project Technical Specifications

- This project is a Nuxt based project which uses Vue 3 framework.
- Node version 22.20.0
- NPM version 10.9.3
- Tailwind CSS version 4.1.16 - https://tailwindcss.com/docs
- Nuxt version 4.1.3 - https://nuxt.com/docs/4.x/getting-started
- Nuxt UI version 4.0.1 - https://ui.nuxt.com/docs

---

### Development Preview

**Setup Instruction**

Make sure to install dependencies:

```bash
npm install
```

**Development Server**

Start the development server on `http://localhost:8080`:

```bash
npm run dev
```

---

### Deploying to Production

**Build the project locally**

Build project to generate required files:

```bash
npm run build
```

**Preview Built Project**

Preview built on Local server on `http://localhost:3000`:

```bash
npm run preview
```

**Compressed and send output file to server**

Tar built project file (.output & package.json)

```bash
tar -czvf nuxt-build.tar.gz .output ./package.json
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
