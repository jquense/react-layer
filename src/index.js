'use strict';
var ReactDOM = require('react-dom');

module.exports = class Layer {

  constructor(container, render){
    this._container = container
    this._render = render
  }

  render(cb, parentComponent){
    if (!this._mountPoint)
      this._createMountPoint();

    var child = this._render()

    return parentComponent ?
      ReactDOM.unstable_renderSubtreeIntoContainer(parentComponent, child, this._mountPoint, cb) :
      ReactDOM.render(child, this._mountPoint, cb);
  }

  unmount() {
    if(!this._mountPoint) return

    ReactDOM.unmountComponentAtNode(this._mountPoint);
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