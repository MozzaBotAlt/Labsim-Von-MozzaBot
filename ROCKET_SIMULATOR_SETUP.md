# Rocket Simulator Integration Guide

## Overview

The Sugar Rocket Simulator is a React + Vite application integrated into the Labsim Von MozzaBot site. It provides an interactive physics simulation for designing and launching sugar rockets.

## Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Install dependencies at root level:**
   ```bash
   npm install
   ```

2. **Develop the rocket simulator:**
   ```bash
   npm run dev
   ```
   This will start the Vite development server on `http://localhost:3000`

### Building for Production

1. **Build the rocket simulator:**
   ```bash
   npm run build:rocket
   ```
   This compiles the React app into static files in the `dist/` folder.

2. **Or full build:**
   ```bash
   npm run build
   ```
   This builds the rocket simulator and copies the dist folder to `rocketsimulator-dist` at the root.

## Vercel Deployment

The rocket simulator is automatically built and deployed with the main site using the `vercel.json` configuration.

### Configuration Details

- **vercel.json**: Routes all requests to `/labsim/others/rocketsimulator/*` to the built static files
- **vite.config.ts**: Sets the base path to `/labsim/others/rocketsimulator/` for production builds
- **Environment Variables**: Set `VITE_GEMINI_API_KEY` in Vercel project settings for AI integration

### Before Pushing to Vercel

1. Ensure `.env.production` is configured with the correct API key
2. Test locally: `npm run preview`
3. Commit all changes including `package.json` and `vercel.json`

## Accessing the Simulator

After deployment:

1. **From Others Menu**: Navigate to `Labsim → Other Simulators → Rocket Simulator`
2. **Direct URL**: Visit `/labsim/others/rocketsimulator/`

## Features

- **Design Phase**: Choose rocket body shape, fins, and nose cone
- **Mixing Phase**: Combine KNO₃ and sugar in precise ratios
- **Heating Phase**: Properly heat the mixture for optimal combustion
- **Packing Phase**: Carefully pack the fuel for maximum thrust
- **Launch & Analysis**: Simulate flight and analyze telemetry data

## Architecture

```
frontend/labsim/others/rocketsimulator/
├── src/
│   ├── main.tsx          (React entry point)
│   ├── App.tsx           (Main simulator component)
│   └── index.css         (Tailwind CSS)
├── index.html            (HTML entry point)
├── vite.config.ts        (Build configuration)
├── package.json          (Dependencies)
└── .env.production       (Production environment)
```

## Dependencies

- **React 19.0.0**: UI framework
- **Vite 6.2.0**: Build tool
- **Tailwind CSS 4.1.14**: Styling
- **Recharts 3.8.1**: Physics telemetry charts
- **Lucide React**: Icons
- **Motion 12.23**: Animations
- **Google GenAI SDK**: AI integration (optional tips)

## Troubleshooting

### Build Fails on Vercel
- Check `VITE_GEMINI_API_KEY` is set in Vercel project settings
- Verify `vercel.json` routes are correct
- Clear build cache and redeploy

### App Not Loading at URL
- Check browser console for errors
- Verify `base: '/labsim/others/rocketsimulator/'` in `vite.config.ts`
- Ensure dist folder was built correctly

### API Key Issues
- Set environment variable in Vercel dashboard
- Check `.env.production` matches the Vercel variable name
- Use `process.env.VITE_GEMINI_API_KEY` in code to access

## Future Improvements

- [ ] Persistent score tracking
- [ ] Multiplayer rocket championships
- [ ] Custom fuel formulations
- [ ] Advanced aerodynamics modeling
- [ ] Mobile-optimized UI
