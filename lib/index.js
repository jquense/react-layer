"use strict";
var babelHelpers = require("./util/babelHelpers.js");
var ReactDOM = require("react-dom");

module.exports = (function () {
  function Layer(container, render) {
    babelHelpers.classCallCheck(this, Layer);

    this._container = container;
    this._render = render;
  }

  babelHelpers.createClass(Layer, {
    render: {
      value: function render(cb) {
        if (!this._mountPoint) this._createMountPoint();

        var child = this._render();

        return ReactDOM.render(child, this._mountPoint, cb);
      }
    },
    unmount: {
      value: function unmount() {
        if (!this._mountPoint) {
          return;
        }ReactDOM.unmountComponentAtNode(this._mountPoint);
      }
    },
    destroy: {
      value: function destroy() {
        this.unmount();

        if (this._mountPoint) {
          this._container.removeChild(this._mountPoint);
          this._mountPoint = null;
        }
      }
    },
    _createMountPoint: {
      value: function _createMountPoint() {
        this._mountPoint = document.createElement("div");
        this._container.appendChild(this._mountPoint);
      }
    }
  });
  return Layer;
})();