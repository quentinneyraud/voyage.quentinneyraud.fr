import '../lib/ThrowPropsPlugin.min'
import { TweenMax, Power1 } from "gsap/umd/TweenMax"
import Draggable from "gsap/umd/Draggable"

const AVAILABLE_EVENTS = ['newIndex', 'liveIndex', 'currentElementClicked', 'onDrag', 'onDragEnd', 'onPress', 'onRelease', 'onThrowComplete', 'startGoTo']
const DEFAULT_OPTIONS = {
  moveOnWheel: false,
  moveOnClick: false,
  moveOnKey: false,
  resizeListener: false,
  wheelSensibility: 60,
  wheelDelay: 800,
  resizeDebounceTime: 250
}
let resizeDebounce = null

export default class DraggableSkew {
  constructor (domElement, options, draggableOptions, startIndex = 0) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
    this.index = startIndex
    this.eventsCallbacks = []

    // Elements
    this.list = domElement
    this.elements = Array.from(this.list.children)

    this.createInstance(draggableOptions)

    // Listeners
    this.onResize = this.onResize.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.initializeEvents()

    if (this.index !== 0) {
      this.jumpToIndex(this.index)
    }
  }

  createInstance (overrideOptions) {
    this.draggableInstance = Draggable.create(this.list, {
      type: 'x',
      bounds: this.getBounds(),
      throwProps: true,
      throwResistance: 1000,
      //maxDuration: 10,
      //minDuration: 0.2,
      overshootTolerance: 0,
      snap: this.getSnaps(),
      force3D: true,
      cursor: 'move',
      autoScroll: false,
      dragResistance: 0,
      edgeResistance: 1,
      zIndexBoost: false,
      allowNativeTouchScrolling: true,
      minimumMovement: 2,
      dragClickables: true,
      allowContextMenu: true,
      allowEventDefault: false,
      onDrag: (e) => {
        const closestIndex = this.draggableInstance.vars.snap.indexOf(this.draggableInstance.vars.snap.reduce((prev, curr) => {
          return (Math.abs(curr - this.draggableInstance.x) < Math.abs(prev - this.draggableInstance.x) ? curr : prev)
        }))
        this.list.classList.add('grabbing')
        this.dispatch('liveIndex', closestIndex)
        this.dispatch('onDrag', e)
      },
      onDragEnd: (e) => {
        this.dispatch('onDragEnd', e)
      },
      onPress: (e) => {
        this.dispatch('onPress', e)
      },
      onRelease: (e) => {
        this.dispatch('onRelease', e)
        this.list.classList.remove('grabbing')
      },
      onThrowUpdate: () => {
        const closestIndex = this.draggableInstance.vars.snap.indexOf(this.draggableInstance.vars.snap.reduce((prev, curr) => {
          return (Math.abs(curr - this.draggableInstance.x) < Math.abs(prev - this.draggableInstance.x) ? curr : prev)
        }))
        this.dispatch('liveIndex', closestIndex)
      },
      onThrowComplete: (e) => {
        this.dispatch('onThrowComplete', e)
        const oldIndex = this.index
        this.index = this.draggableInstance.vars.snap.indexOf(this.draggableInstance.x)
        this.dispatch('newIndex', {
          oldIndex,
          newIndex: this.index
        })
      },
      ...overrideOptions
    })[0]
  }

  destroy () {
    window.removeEventListener('wheel', this.onWheel)
    this.elements.forEach(el => el.removeEventListener('click', this.onClick))
    window.removeEventListener('keydown', this.onKeyDown)
  }

  on (eventName, callback) {
    if (AVAILABLE_EVENTS.indexOf(eventName) === -1) {
      console.warn(`event ${eventName} not available. Existing events : ${AVAILABLE_EVENTS.join(', ')}`)
      return
    }
    (this.eventsCallbacks[eventName] = this.eventsCallbacks[eventName] || []).push(callback)
  }

  dispatch (eventName, datas) {
    // console.log('dispatch', eventName)
    this.eventsCallbacks[eventName] && this.eventsCallbacks[eventName].forEach(cb => cb(datas))
  }

  initializeEvents () {
    if (this.options.moveOnWheel) {
      window.addEventListener('wheel', this.onWheel)
    }
    if (this.options.moveOnClick) {
      this.elements.forEach(el => el.addEventListener('click', this.onClick))
    }
    if (this.options.moveOnKey) {
      window.addEventListener('keydown', this.onKeyDown)
    }
    if (this.options.resizeListener) {
      window.addEventListener('resize', this.onResize)
    }
  }

  getSnaps () {
    return this.elements.map(el => {
      return el.offsetLeft * -1
    })
  }

  getBounds () {
    return {
      minX: this.elements[this.elements.length - 1].offsetLeft * -1,
      maxX: 0
    }
  }

  onResize () {
    clearTimeout(resizeDebounce)
    resizeDebounce = setTimeout(() => {
      this.draggableInstance.applyBounds(this.getBounds())
      this.draggableInstance.vars.snap = this.getSnaps()
      // auto snap
      this.jumpToIndex(this.index)
    }, this.options.resizeDebounceTime)
  }

  onWheel (e) {
    if (Math.abs(e.deltaY) > this.options.wheelSensibility) {
      if (e.deltaY > 0)
        this.goToNext()

      if (e.deltaY < 0)
        this.goToPrevious()

      window.removeEventListener('wheel', this.onWheel)
      window.setTimeout(() => window.addEventListener('wheel', this.onWheel), this.options.wheelDelay)
    }
  }

  onKeyDown (e) {
    if (e.which === 38) {
      this.goToPrevious()
    } else if (e.which === 40) {
      this.goToNext()
    }
  }

  onClick (e) {
    let clickedIndex = this.elements.indexOf(e.target)

    if (clickedIndex === this.index) {
      this.dispatch('currentElementClicked', this.index)
    } else {
      this.goToIndex(clickedIndex)
    }
  }

  goToNext () {
    if (this.index < this.elements.length - 1) {
      this.goToIndex(this.index + 1)
    }
  }

  goToPrevious () {
    if (this.index > 0) {
      this.goToIndex(this.index - 1)
    }
  }

  goToIndex (newIndex) {
    const datas = {
      oldIndex: this.index,
      newIndex
    }

    this.dispatch('startGoTo', datas)
    this.index = newIndex

    new TimelineMax()
      .to(this.draggableInstance.target, 0.6, {
        x: this.elements[this.index].offsetLeft * -1,
        ease: Power1.easeInOut,
        onUpdate: this.draggableInstance.update,
        onComplete: () => {
          this.dispatch('newIndex', datas)
        }
      })
  }

  jumpToIndex (newIndex) {
    const datas = {
      oldIndex: this.index,
      newIndex
    }
    TweenMax.set(this.draggableInstance.target, {
      x: this.elements[this.index].offsetLeft * -1,
      onComplete: () => {
        this.dispatch('newIndex', datas)
      }
    })
  }
}
