# react-layer

Simple abstraction for creating and managing new render trees

## Install

```sh
npm i -S react-layer
```

### Use

A Layer is a simple class that manages the mounting and unmounting of a ReactElements to a specific container element. This is helpful for when, in the course of a react heirarchy you need to append a component outside of the current render tree. The canonical example of this pattern is overlays or modals that need to be appended to the document body. 

Simply put This is the React equivalent to  jquery's `appendTo` (`$('node').appendTo('body')`)

### `new Layer(container, renderFn)`

The Layer object takes two constructor arguments `container` which is a DOM node that the layer will be mounted too,such as the `body`, and `render`, a function that, when called, returns the ReactElements to render into the container

### `Layer.render()`

Mounts and Renders the return value of the function provided in the constructor (`renderFn`) to the container

### `Layer.unmount()`

Unmounts the component from the container, but leaves the mount point node in the DOM.

### `Layer.destroy()`

Unmounts, and removes all traces of the layer from the container. This calls `unmount()` so there is no need to call it in addition to `destroy`.

```javascript
var Layer = require('react-layer')
var Modal = require('some-modal-component')

// here is a simple async alert()
function alert(message, callback) {
  var layer = new Layer(document.body, function renderModal(){
        return (
          <Modal show onHide={finish}>
            <Modal.Body>
              <h4>{message}</h4>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={finish}>Close</button>
            </Modal.Footer>
          </Modal>
        )
      })

  // actually renders our Modal off of the document.body
  layer.render()

  function finish(){
      callback()
      layer.destroy() // unmount and remove the React Component tree
  }
}

alert('hello there!')

```

