import { MDXProvider } from "@mdx-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { mdxComponents } from "./content/mdx-components";
import "./styles/global.css";

const root = document.getElementById("root");
if (!root) throw new Error("root missing");

createRoot(root).render(
  <StrictMode>
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MDXProvider>
  </StrictMode>,
);
