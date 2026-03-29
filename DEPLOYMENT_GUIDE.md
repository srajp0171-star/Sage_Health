# Sage Healthcare Deployment Guide

This workspace is structured as a monorepo containing two React/Vite applications:
1.  **sage-healthcare-configurator**
2.  **sage-demo-clinic**

Follow these steps to push everything to GitHub and host both applications on Vercel.

## 1. Push to GitHub

Since you have two apps in one folder, we'll initialize a single git repository for the root folder.

### Step 1: Initialize Git
Open your terminal in `d:/Projects_launch/Sage_Healthcare` and run:
```powershell
git init
git add .
git commit -m "initial commit: Sage Healthcare configurator and clinic demo"
```

### Step 2: Create a GitHub Repo & Remote
1.  Go to [github.com/new](https://github.com/new).
2.  Create a repository (e.g., `sage-healthcare`).
3.  Copy the remote URL and run:
```powershell
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

---

## 2. Host on Vercel

Vercel can host both sub-projects separately from the same GitHub repository.

### App 1: [Sage Healthcare Configurator]
1.  Go to the [Vercel Dashboard](https://vercel.com/new).
2.  Import your new GitHub repository.
3.  **IMPORTANT**: In the "Configure Project" screen, click **Edit** next to "Root Directory".
4.  Select `sage-healthcare-configurator`.
5.  Click **Deploy**.

### App 2: [Sage Clinic Management Demo]
1.  Click **Add New...** -> **Project** on your Vercel Dashboard.
2.  Import the **same** GitHub repository again.
3.  **IMPORTANT**: In the "Configure Project" screen, click **Edit** next to "Root Directory".
4.  Select `sage-demo-clinic`.
5.  Click **Deploy**.

---

## Technical Details

-   **Framework Preset**: Vercel will automatically detect `Vite` for both.
-   **Build Command**: `npm run build` (which runs `tsc && vite build`).
-   **Output Directory**: `dist`.

Your applications will now be reachable at their own Vercel URLs and will automatically re-deploy whenever you push code changes to GitHub!
