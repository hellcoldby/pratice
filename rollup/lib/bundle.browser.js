!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("tslib").__importDefault(require("zrender"));console.log("hello world");const t=document.getElementsByClassName("box")[0],n=e.default.init(t),i=n.getWidth(),l=n.getHeight(),o=new e.default.Circle({shape:{cx:30,cy:l/2,r:30},style:{fill:"transparent",stroke:"#FF6EBE"},silent:!0});o.animate("shape",!0).when(5e3,{cx:i-30}).when(1e4,{cx:30}).start(),n.add(o)}));
//# sourceMappingURL=bundle.browser.js.map