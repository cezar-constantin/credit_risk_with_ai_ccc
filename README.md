# Credit Risk with AI CCC

Interactive browser-based simulator for building a credit rating workflow end to end, restyled to match the visual language of `neural_network_ccc`:

- upload a portfolio dataset
- prepare data and select variables
- estimate a rating model
- validate, monitor, and calibrate the model
- compute Basel III and Basel IV RWAs
- keep the interface, the generated R code, and the methodology synchronized

## Files

- `index.html`: app shell
- `styles.css`: CCC portfolio-style visual system inspired by `neural_network_ccc`
- `app.js`: browser-side analytics, synchronized editors, exports, and rendering
- `server.mjs`: lightweight local web server for browser-based local runs
- `start-local.ps1`: Windows launcher that can open the app in the browser
- `package.json`: local run scripts
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment

## Deployment

This app is static and ready for GitHub Pages:

1. Push the folder contents to a GitHub repository.
2. Enable GitHub Pages with GitHub Actions.
3. The workflow in `.github/workflows/deploy-pages.yml` deploys the site automatically on pushes to `main`.

## Notes

- Data is processed in the browser.
- R code and methodology are generated step by step from the live simulator state.
- `Save & Sync` reads the state block embedded at the top of each editor and propagates changes back to the interface.

## Run Locally

### Option 1: npm

```bash
npm start
```

This serves the simulator at:

```text
http://127.0.0.1:4173/
```

To start the server and open the browser automatically:

```bash
npm run start:open
```

### Option 2: PowerShell

```powershell
.\start-local.ps1
```

To choose a different port:

```powershell
.\start-local.ps1 -Port 4300
```
