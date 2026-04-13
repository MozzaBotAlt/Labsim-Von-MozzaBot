# Rocket Simulator - Vanilla HTML/CSS/JavaScript

## Overview

The Sugar Rocket Simulator is a lightweight, framework-free interactive physics simulation for designing and launching sugar rockets. No build tools or frameworks required - runs directly in the browser.

## Features

- **Design Phase**: Choose rocket body shape, fins, and configure mass
- **Fuel Mixing**: Control fuel composition ratios (KNO₃ and sugar)
- **Heating Control**: Set temperature and burn time parameters
- **Launch Animation**: Visual rocket flight simulation
- **Flight Telemetry**: Calculate max altitude, velocity, and flight time
- **Results Export**: Download launch data as text files

## File Structure

```
frontend/labsim/others/rocketsimulator/
├── index.html            (Main HTML interface)
├── simulator.js          (JavaScript logic & physics engine)
├── package.json          (Metadata only - no build required)
└── metadata.json         (Project metadata)
```

## Local Testing

Simply open `index.html` in a web browser:
```bash
# Option 1: Direct open
open frontend/labsim/others/rocketsimulator/index.html

# Option 2: Local server (Python)
cd frontend/labsim/others/rocketsimulator
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Local server (Node.js)
npx http-server
```

## How It Works

### Physics Calculations
The simulator uses simplified physics equations to calculate:
- **Thrust**: Based on fuel amount, temperature, and mixture quality
- **Acceleration**: F = (thrust / total_mass) * g
- **Max Velocity**: a × burn_time
- **Max Altitude**: ½ × burn_time × max_velocity
- **Flight Time**: 2 × (max_velocity / gravity)
- **Efficiency**: Quality of fuel mixture (0-100%)

### Optimal Settings
For best results, aim for:
- **KNO₃**: 65% (±5% tolerance)
- **Sugar**: 35% (±5% tolerance)
- **Temperature**: 350°C ±50°C
- **Burn Time**: 3-4 seconds

## Deployment

### Vercel/GitHub Pages
Simply commit the files - no build step needed. The HTML and JavaScript load directly.

### Environment Variables
Not required. The simulator works completely offline.

## Troubleshooting

### "Vite not found" or similar build errors
✓ Fixed - Now uses vanilla HTML/CSS/JavaScript, no frameworks or build tools

### Simulator not loading
- Clear browser cache
- Check browser console for JavaScript errors (F12)
- Ensure all files are in the correct paths

### Results not exporting
- Check browser permissions for file downloads
- Some browsers may block downloads - try a different browser if needed

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **File Size**: ~15KB total (index.html + simulator.js)
- **Load Time**: < 100ms
- **Memory**: < 5MB
- **CPU**: Minimal - optimized for smooth animations

## Future Enhancements

Possible additions (without frameworks):
- Weather effects (wind simulation)
- Custom color themes
- Multi-stage rocket support
- Advanced telemetry charts (using Canvas API)

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
