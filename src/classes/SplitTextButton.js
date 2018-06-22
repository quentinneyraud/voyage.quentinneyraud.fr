import SplitText from '../lib/SplitText.min'

export default class SplitTextButton {
  /**
   *
   * @param {HTMLElement|string} domElement
   */
  constructor (domElement) {
    this.splittedText = new SplitText(domElement)
    this.chars = this.splittedText.chars
    this.reset()

    this.splittedText.elements[0].addEventListener('click', (e) => {
      console.log(e)
    })
  }

  /**
   * Update link href
   * @param {string} link
   */
  setLink (link) {
    this.splittedText.elements[0].href = link
  }

  /**
   * Reset chars position
   */
  reset () {
    TweenMax.set(this.chars, {
      yPercent: 100
    })
  }

  /**
   * Show button
   */
  show () {
    TweenMax.staggerTo(this.chars, 0.3, {
      yPercent: 0
    }, 0.05)
  }

  /**
   * Hide button
   */
  hide () {
    TweenMax.staggerTo(this.chars, 0.3, {
      yPercent: -100,
      onComplete: this.reset.bind(this)
    }, 0.05)
  }
}
