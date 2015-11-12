# react-layer

Simple abstraction for creating and managing new render trees

## Install

```sh
npm i -S react-layer
```

### Use

A Layer is a simple class that manages the mounting and unmounting of a ReactElements to a specific container element. This is helpful for when, in the course of a react heirarchy you need to append a component outside of the current render tree. The canonical example of this pattern is overlays or modals that need to be appended to the document body. 

Simply put this sort of like the React equivalent to  jquery's `appendTo` (`$('node').appendTo('body')`)

### `new Layer(container, renderFn)`

The Layer object takes two arguments: a `container`, which is a DOM node that the layer will be mounted too (such as the `document.body`), and `render`, a function that, when called, returns a `ReactElement` to render into the container

### `Layer.render(cb, parentComponent)`

Mounts and Renders the return value of the function provided in the constructor (`renderFn`) to the container

Takes two optional arguments: `cb`, a callback that will be called after the layer has been rendered, and a `parentComponent`, which is a React Component that is the conceptual parent of the layer. If `parentComponent` is provided, its React context will be passed along to the layer.

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


If you want to create a component that represents the layer you can do that with a fairly simple Higher Order Component. The below example will tie the lifecycle of the `Layer` with the component that creates it. You can just provide a render method and the HOC will ensure that it is created and rendered at the right time. 

```jsx

let createLayeredComponent = render => class extends React.Component {

  static propTypes = {
    container: React.PropTypes.any
  }

  componentWillUnmount () {
    this._layer.destroy()
    this._layer = null
  }

  componentDidUpdate() {
    this._renderOverlay();
  }

  componentDidMount() {
    this._renderOverlay();
  }

  _renderOverlay() {
    if (!this._layer)
      this._layer = new Layer(this.props.container || document.body, () => this._child)

    this._layer.render()
  }

  render() {
    this._child = render(this.props) //create the elements in render(), otherwise Owner can be lost
    return null;
  }
}

// and In use....

var LayeredComponent = createLayeredComponent(function(props){
  return (
    <MyComponentIWantRenderedInALayer {...props}>
      {props.children}
    </MyComponentIWantRenderedInALayer>
  )
})
```

