import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Main from "./pages/Main";
import reportWebVitals from "./reportWebVitals";


//react18  createRoot 代替了 ReactDom.render
const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        {/* <Provider {...store}> */}
            <Main />
        {/* </Provider>   */}
    </React.StrictMode>
);
reportWebVitals();

//webpack 配置devServer后， node中的module会挂载上一个 hot对象，用来触发热更新
if (module.hot) {
    module.hot.accept("./pages/Main", function () {
        const Main = require("./pages/Main");
        root.render(
            <React.StrictMode>
                <Main />
            </React.StrictMode>
        );
    });
}
