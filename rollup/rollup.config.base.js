import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
import json from "rollup-plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import eslint from "@rollup/plugin-eslint";
import { babel } from '@rollup/plugin-babel';
const formatName = "hello";
export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    
    },
    {
      file: pkg.module,
      format: "esm",
    },
    {
      file: pkg.browser,
      format: "umd",
      name: formatName,
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    commonjs({
     
    }),
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      brower: true,
    }),
    typescript(),
    eslint(),
    babel({
      babelHelpers: 'bundled',
       exclude: "node_modules/**" 
      }),

  ],
};