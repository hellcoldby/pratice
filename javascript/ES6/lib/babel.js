"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/array/from"));

require("core-js/modules/es.function.name.js");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _utils = require("./utils");

(0, _utils.greeting)();
var a = 1;
var b = 2;
var c = a + b;

var fun = function fun() {
  return 'hello ';
};

var A = /*#__PURE__*/function () {
  function A(name) {
    (0, _classCallCheck2.default)(this, A);
    this.name = name;
  }

  (0, _createClass2.default)(A, [{
    key: "info",
    value: function info(age) {
      console.log(this.name + age);
    }
  }]);
  return A;
}();

(0, _defineProperty2.default)(A, "a", 'hello');
var array = [1, 2, 3];
var newAry = (0, _from.default)(array);
console.log(newAry);