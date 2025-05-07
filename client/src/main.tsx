import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Install fontawesome
const fontAwesomeScript = document.createElement("script");
fontAwesomeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js";
document.head.appendChild(fontAwesomeScript);

// Add JetBrains Mono and Inter fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// Add title
const titleEl = document.createElement("title");
titleEl.textContent = "AlgoTutor - DSA Learning Assistant";
document.head.appendChild(titleEl);

// Add meta description
const metaDesc = document.createElement("meta");
metaDesc.name = "description";
metaDesc.content = "Learn data structures and algorithms with AlgoTutor, an AI-powered assistant that provides explanations, code examples, and practice problems.";
document.head.appendChild(metaDesc);

createRoot(document.getElementById("root")!).render(<App />);
