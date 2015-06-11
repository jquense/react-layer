var React = require('react')
var Layer = require('../src')
var contains = require('dom-helpers/query/contains')

describe('React Layer', ()=>{
  var layer;

  beforeEach(()=>{
    layer = new Layer(document.body, ()=> <div className='test'/>)
  })

  afterEach(()=>{
    React.unmountComponentAtNode(layer._mountPoint)
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

    console.log(instance)
    ; (!!instance).should.equal(true)
  })

  it('should destroy layer', ()=>{
    layer.render()
    var mount = layer._mountPoint

    layer.destroy()

    document.querySelectorAll('.test').length.should.equal(0);

    contains(document.body, mount).should.equal(false);

    (layer._mountPoint === null).should.equal(true)
  })
})