(()=>{var e,t={747:(e,t,r)=>{"use strict";var n=r(294),l=r(745);function o(){const[e,t]=(0,n.useState)(0);return console.log("child"),n.createElement("p",{style:{fontWeight:"bolder"},onClick:function(r){t(0===e?1:0),r.stopPropagation()}},"React.memo(子组件) ---click:---\x3e",n.createElement("button",null,e))}const c=n.memo(o);var a=r(790),i=r.n(a);const s=function(){const[e,t]=(0,n.useState)(0);return console.log("main"),n.createElement(n.Fragment,null,n.createElement("div",{style:{overflow:"hidden"}},n.createElement("h1",{style:{float:"left",width:"300px",border:"1px solid red"},onClick:()=>{t(0===e?123:0)}}," ","hello world1!",n.createElement("p",null,"click：---\x3e",n.createElement("button",null,e)),n.createElement("p",null," 父级状态变化 不触发子组件更新 "),n.createElement(c,null)),n.createElement("div",{style:{float:"left",paddingRight:"50px"}},n.createElement("p",null,"背景图"),n.createElement("div",{className:"bg_b9Wtf"})),n.createElement("div",{style:{float:"left",paddingRight:"50px"}},n.createElement("p",null,"image 图"),n.createElement("img",{src:i()}))),n.createElement("h2",{style:{color:"red"}},"test"))};var u;(0,l.s)(document.getElementById("root")).render(n.createElement(n.StrictMode,null,n.createElement(s,null))),u&&u instanceof Function&&r.e(216).then(r.bind(r,131)).then((({getCLS:e,getFID:t,getFCP:r,getLCP:n,getTTFB:l})=>{e(u),t(u),r(u),n(u),l(u)}))},790:(e,t,r)=>{e.exports=r.p+"img/bbfa3fddb382c2ee718d472c72cd6254.jpg"}},r={};function n(e){var l=r[e];if(void 0!==l)return l.exports;var o=r[e]={exports:{}};return t[e](o,o.exports,n),o.exports}n.m=t,e=[],n.O=(t,r,l,o)=>{if(!r){var c=1/0;for(u=0;u<e.length;u++){for(var[r,l,o]=e[u],a=!0,i=0;i<r.length;i++)(!1&o||c>=o)&&Object.keys(n.O).every((e=>n.O[e](r[i])))?r.splice(i--,1):(a=!1,o<c&&(c=o));if(a){e.splice(u--,1);var s=l();void 0!==s&&(t=s)}}return t}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[r,l,o]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.e=()=>Promise.resolve(),n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e+"../"})(),(()=>{var e={179:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var l,o,[c,a,i]=r,s=0;if(c.some((t=>0!==e[t]))){for(l in a)n.o(a,l)&&(n.m[l]=a[l]);if(i)var u=i(n)}for(t&&t(r);s<c.length;s++)o=c[s],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(u)},r=self.webpackChunkwebpack_dev_test=self.webpackChunkwebpack_dev_test||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var l=n.O(void 0,[216],(()=>n(747)));l=n.O(l)})();
//# sourceMappingURL=main.js.map