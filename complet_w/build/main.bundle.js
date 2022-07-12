
(() => {

    var __webpack_modules__ = {
        "./src/a.js":
            (module, __unused_webpack_exports, __webpack_require__) => {
                eval(
                    "let b = __webpack_require__(/*! ./base/b.js */ \"./src/base/b.js\");\nconsole.log(b);\n\nmodule.exports = 'a'+b;\n\n//# sourceURL=webpack:///./src/a.js?"
                );
            },
        "./src/base/b.js": (module) => {
            eval("module.exports = 'b';\n\n//# sourceURL=webpack:///./src/base/b.js?");
        },

        "./src/index.js":
            (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
                eval('let str = __webpack_require__(/*! ./a.js */ "./src/a.js");\nconsole.log(str);\n\n//# sourceURL=webpack:///./src/index.js?');
            },
    };

    var __webpack_module_cache__ = {};

    function __webpack_require__(moduleId) {
        // Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports; 
        }
        // Create a new module (and put it into the cache)
        var module = (__webpack_module_cache__[moduleId] = {
            // no module.id needed
            // no module.loaded needed
            exports: {},
        });

        // Execute the module function
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

        // Return the exports of the module
        return module.exports;
    }

    var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
