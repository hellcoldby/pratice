import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Main from "./pages/Main";
import reportWebVitals from "./reportWebVitals";
const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);
reportWebVitals();

if (module.hot) {
    module.hot.accept();
}
