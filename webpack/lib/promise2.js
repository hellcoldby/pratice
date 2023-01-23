"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var MyPromise = /*#__PURE__*/function () {
  function MyPromise(fn) {
    var _this = this;

    _classCallCheck(this, MyPromise);

    this.state = 'pending';
    this.value = null;

    var resolve = function resolve(value) {
      _this.state = 'success';
      _this.value = value;
    };

    fn(resolve);
  }

  _createClass(MyPromise, [{
    key: "then",
    value: function then(onFulfilled, onRejected) {
      if (this.state === 'success') {
        onFulfilled(this.value);
      }
    }
  }]);

  return MyPromise;
}();

var p = new MyPromise(function (resolve) {
  resolve('hello');
});
p.then(function (res) {
  console.log(res);
});