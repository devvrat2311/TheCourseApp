# Frontend Architecture

[Back to Main Page](../README.md)

## Frontend Directory Structure


```
client/    # during development phase (react/vite)
├─src/
│  ├─assets/
│  │ └─react.svg 
│  ├─components/
│  ├─pages/
│  ├─utils/
│  ├─App.css
│  ├─App.jsx
│  ├─index.css
│  └─main.jsx
│
├─public/
│  └─vite.svg
│
├─index.html
├─vite.config.js    # vite configuration
├─package.json
├─package-lock.json
├─eslint.config.js  # ESLint config
└─README.md
```

## How the frontend talks to the backend

- The frontend is connected to the backend via CORS (cross-origin resource sharing). 

- In development the **frontend runs on the PORT:5173**, the usual port Vite uses and the backend runs on its different port, which is PORT:5000 or as defined in the .env file.
