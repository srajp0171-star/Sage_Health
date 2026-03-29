# Sage Healthcare Solutions

This repository contains two primary web applications for Sage Tech Solutions:

1.  **[Sage Healthcare Digital Configurator](./sage-healthcare-configurator/)**: A sophisticated sales tool for clinics to configure their digital infrastructure, calculate pricing, and visualize their setup.
2.  **[Sage Clinic Management Platform Demo](./sage-demo-clinic/)**: A high-fidelity, interactive clinic management demo that reflects configurations made in the configurator.

## Tech Stack
-   **Frontend**: React + Vite
-   **Styling**: TailwindCSS
-   **State Management**: React Hooks
-   **Deployment**: Vercel

## Local Development

To run each project locally:

### 1. Configurator
```powershell
cd sage-healthcare-configurator
npm install
npm run dev
```

### 2. Clinic Demo
```powershell
cd sage-demo-clinic
npm install
npm run dev
```

## Vercel Deployment

Both projects are ready for Vercel deployment. When setting up in Vercel:
-   **Configurator**: Set the Root Directory to `sage-healthcare-configurator`.
-   **Clinic Demo**: Set the Root Directory to `sage-demo-clinic`.
