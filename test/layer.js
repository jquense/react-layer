var React = require('react')
var ReactDOM = require('react-dom')
var Layer = require('../src')
var contains = require('dom-helpers/query/contains')

describe('React Layer', ()=>{
  var layer;

  beforeEach(()=>{
    layer = new Layer(document.body, ()=> <div className='test'/>)
  })

  afterEach(()=>{
    if(layer._mountPoint)
      ReactDOM.unmountComponentAtNode(layer._mountPoint)
  })

  it('should create mount point', ()=>{
    layer._createMountPoint()

    document.body.children[document.body.children.length - 1]
      .should.equal(layer._mountPoint)
  })

  it('should mount react Component', ()=>{
    layer.render()
    document.querySelectorAll('.test').length.should.equal(1)
  })

  it('should unmount react Component', ()=>{
    layer.render()
    layer.unmount()

    document.querySelectorAll('.test').length.should.equal(0)

    contains(document.body, layer._mountPoint).should.equal(true)
  })

  it('should return an instance', ()=> {
    var instance = layer.render()

    console.log(instance);
    (!!instance).should.equal(true)
  })

  it('should destroy layer', ()=>{
    layer.render()
    var mount = layer._mountPoint

    layer.destroy()

    document.querySelectorAll('.test').length.should.equal(0);

    contains(document.body, mount).should.equal(false);

    (layer._mountPoint === null).should.equal(true)
  })

  it('should pass parent context to layer', ()=> {
    const ParentWithContext = React.createClass({
      childContextTypes: {
        test: React.PropTypes.string
      },
      getChildContext() {
        return {test: 'contextTest'}
      },
      componentDidMount() {
        this.layer = new Layer(this.props.layerContainer, ()=> <ChildUsingContext />);
        this.layer.render(null, this);
      },
      componentWillUnmount() {
        this.layer.destroy();
      },
      render() {
        return <div className="parent" />;
      }
    });

    const ChildUsingContext = React.createClass({
      contextTypes: {
        test: React.PropTypes.string
      },
      render() {
        return <div className="test">{this.context.test || "no context"}</div>;
      }
    });

    const parentContainer = document.createElement('div');
    parentContainer.setAttribute('id', 'parentContainer');
    document.body.appendChild(parentContainer);

    const layerContainer = document.createElement('div');
    parentContainer.setAttribute('id', 'layerContainer');
    document.body.appendChild(layerContainer);

    ReactDOM.render(<ParentWithContext layerContainer={layerContainer}/>, parentContainer);

    const layerEls = document.querySelectorAll('.test');
    layerEls.length.should.equal(1);
    layerEls[0].innerText.should.equal('contextTest');

    ReactDOM.unmountComponentAtNode(parentContainer);
    document.body.removeChild(parentContainer);
    document.body.removeChild(layerContainer);
  })
})