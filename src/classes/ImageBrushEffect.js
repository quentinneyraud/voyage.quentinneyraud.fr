import '../lib/MorphSVGPlugin.min'

class Canvas {
  constructor (canvas = null) {
    this.canvas = (canvas) ? canvas : document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
  }

  setSize (width = window.innerWidth, height = window.innerHeight) {
    this.canvas.width = width
    this.canvas.height = height
  }
}

export default class ImageBrushEffect {
  constructor (canvas, svgPaths) {
    this.animations = []
    this.svgPaths = document.getElementById(svgPaths).getElementsByTagName('path')

    // clipping Canvas
    this.svgViewBox = document.getElementById(svgPaths).viewBox.baseVal
    this.clippingCanvas = new Canvas()

    // rendering Canvas
    this.renderingCanvas = new Canvas(canvas)

    this.image = new Image()
    this.brush = new Image()
  }

  setBrush (brushSrc) {
    this.brush.src = brushSrc

    return new Promise(resolve => {
      this.brush.onload = resolve
    })
      .then(() => {
        this.clippingCanvas.setSize(this.svgViewBox.width * 2 + this.brush.width, this.svgViewBox.height * 2 + this.brush.height)
      })
  }

  setImage (imageSrc) {
    this.image.src = imageSrc

    return new Promise(resolve => {
      this.image.onload = resolve
    })
      .then(() => {
        this.clippingCanvas.setSize(this.clippingCanvas.canvas.width, this.clippingCanvas.canvas.height)
        this.renderingCanvas.setSize(this.image.width, this.image.height)
      })
  }

  hide () {
    this.animations.forEach(a => a.kill())
    const { context: ctx, canvas } = this.renderingCanvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  show () {
    this.hide()
    Array.from(this.svgPaths).forEach(path => this.animateBrushAlongPath(path))
  }

  animateBrushAlongPath (path) {
    let bezierData = MorphSVGPlugin.pathDataToBezier(path)
    let brushPosition = {}
    let animation = TweenMax.to(brushPosition, 1, {
      bezier: {
        values: bezierData,
        type: "cubic"
      },
      ease: Power2.easeInOut,
      onUpdate: () => {
        this.drawBrush(brushPosition.x * 2, brushPosition.y * 2)
        this.draw()
      }
    })

    this.animations.push(animation)
  }

  drawBrush (x, y) {
    const { context: ctx } = this.clippingCanvas
    ctx.drawImage(this.brush, x, y)
  }

  draw () {
    const { context: ctx, canvas: renderingCanvas } = this.renderingCanvas
    const { canvas: clippingCanvas } = this.clippingCanvas

    const clippingWidth = clippingCanvas.width / 4
    const clippingHeight = clippingCanvas.height / 4
    const position2X = renderingCanvas.width / 2 - clippingWidth / 2
    const position2Y = renderingCanvas.height / 2 - clippingHeight / 2

    ctx.save()
    ctx.drawImage(this.image, 0, 0, renderingCanvas.width, renderingCanvas.height)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.translate(position2X, position2Y)
    ctx.drawImage(clippingCanvas, 0, 0, clippingWidth, clippingHeight)
    ctx.restore()
  }
}
