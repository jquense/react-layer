'use strict';
var React = require('react');

module.exports = class Layer {

  constructor(container, render){
    this._container = container
    this._render = render
  }

  render(cb){
    if (!this._mountPoint)
      this._createMountPoint();

    var child = this._render()

    React.render(child, this._mountPoint, cb);
  }

  unmount() {
    if(!this._mountPoint) return

    React.unmountComponentAtNode(this._mountPoint);
  }

  destroy() {
    this.unmount()

    if (this._mountPoint){
      this._container.removeChild(this._mountPoint)
      this._mountPoint = null;
    }
  }

  _createMountPoint() {
    this._mountPoint = document.createElement('div');
    this._container.appendChild(this._mountPoint);
  }

}