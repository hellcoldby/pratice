// import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
import json from "rollup-plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import eslint from "@rollup/plugin-eslint";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

const formatName = "hello";
export default {
    input: "./src/index.jsx",
    output: [
        // {
        //     file: pkg.main,
        //     format: "esm",
        //     sourcemap: true,
        // },
        // {
        //     file: pkg.module,
        //     format: "esm",
        // },
        {
            file: pkg.browser,
            format: "umd",
            name: formatName,
            sourcemap: true,
        },
    ],
    // 告诉rollup不要将此打包，作为外部依赖
    external: [
        
        "react",
        "react-dom",
        "lodash",
        "zrender",
        "mathjs",
        "zrender/src/core/util",
    ],
    plugins: [
        json(),
        postcss({
            modules: true,
            amedExports: true,
            use: {
                less: { javascriptEnabled: true },
            },
        }),
        commonjs({}),
        resolve({
            preferBuiltins: true,
        
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }),

        // eslint(),
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
        }),
        // typescript({

        //     typescript: require("typescript")
        // }),
    ],
};
