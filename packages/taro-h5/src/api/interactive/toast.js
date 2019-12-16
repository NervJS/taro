import { inlineStyle, interactiveHelper } from '../utils'

const noop = function () {}

export default class Toast {
  options = {
    title: '',
    icon: 'none',
    image: '',
    duration: 1500,
    mask: false,
    success: noop,
    fail: noop,
    complete: noop
  }

  style = {
    maskStyle: {
      'position': 'fixed',
      'z-index': '1000',
      'top': '0',
      'right': '0',
      'left': '0',
      'bottom': '0'
    },
    toastStyle: {
      'z-index': '5000',
      'box-sizing': 'border-box',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      '-webkit-justify-content': 'center',
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'min-width': '120px',
      'max-width': '200px',
      'min-height': '120px',
      'padding': '15px',
      'transform': 'translate(-50%, -50%)',
      'border-radius': '5px',
      'text-align': 'center',
      'line-height': '1.6',
      'color': '#FFFFFF',
      'background': 'rgba(17, 17, 17, 0.7)'
    },
    successStyle: {
      'margin': '0',
      'vertical-align': 'middle',
      'font-family': 'taro',
      '-webkit-font-smoothing': 'antialiased',
      'color': '#FFFFFF',
      'font-size': '55px',
      'line-height': '1'
    },
    loadingStyle: {
      'margin': '6px auto',
      'width': '38px',
      'height': '38px',
      '-webkit-animation': 'taroLoading 1s steps(12, end) infinite',
      'animation': 'taroLoading 1s steps(12, end) infinite',
      'background': 'transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat',
      'background-size': '100%'
    },
    imageStyle: {
      'margin': '6px auto',
      'width': '40px',
      'height': '40px',
      'background': 'transparent no-repeat',
      'background-size': '100%'
    },
    textStyle: {
      'margin': '0',
      'font-size': '16px'
    }
  }

  create (options = {}) {
    // style
    const { maskStyle, toastStyle, successStyle, loadingStyle, imageStyle, textStyle } = this.style

    // configuration
    const config = {
      ...this.options,
      ...options
    }

    // wrapper
    this.el = document.createElement('div')
    this.el.className = 'taro__toast'
    this.el.style.opacity = '0'
    this.el.style.transition = 'opacity 0.1s linear'

    // mask
    this.mask = document.createElement('div')
    this.mask.setAttribute('style', inlineStyle(maskStyle))
    this.mask.style.display = config.mask ? 'block' : 'none'

    // icon
    this.icon = document.createElement('p')
    if (config.image) {
      this.icon.setAttribute('style', inlineStyle({
        ...imageStyle,
        'background-image': `url(${config.image})`
      }))
    } else {
      const iconStyle = config.icon === 'loading' ? loadingStyle : successStyle
      this.icon.setAttribute('style', inlineStyle({
        ...iconStyle,
        ...(config.icon === 'none' ? { 'display': 'none' } : {})
      }))
      if (config.icon !== 'loading') this.icon.textContent = ''
    }

    // toast
    this.toast = document.createElement('div')
    this.toast.setAttribute('style', inlineStyle({
      ...toastStyle,
      ...(config.icon === 'none' ? {
        'min-height': '0',
        'padding': '10px 15px'
      } : {})
    }))

    // title
    this.title = document.createElement('p')
    this.title.setAttribute('style', inlineStyle(textStyle))
    this.title.textContent = config.title

    // result
    this.toast.appendChild(this.icon)
    this.toast.appendChild(this.title)
    this.el.appendChild(this.mask)
    this.el.appendChild(this.toast)

    // show immediately
    document.body.appendChild(this.el)
    // set body position fixed style
    interactiveHelper().handleAfterCreate()
    setTimeout(() => { this.el.style.opacity = '1' }, 0)
    this.type = config._type

    // disappear after duration
    config.duration >= 0 && this.hide(config.duration, this.type)

    const errMsg = this.type === 'loading' ? 'showLoading:ok' : 'showToast:ok'
    config.success && config.success({ errMsg })
    config.complete && config.complete({ errMsg })
    return Promise.resolve({ errMsg })
  }

  show (options = {}) {
    const config = {
      ...this.options,
      ...options
    }

    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    // title
    this.title.textContent = config.title || ''

    // mask
    this.mask.style.display = config.mask ? 'block' : 'none'

    // image
    const { toastStyle, successStyle, loadingStyle, imageStyle } = this.style
    if (config.image) {
      this.icon.setAttribute('style', inlineStyle({
        ...imageStyle,
        'background-image': `url(${config.image})`
      }))
      this.icon.textContent = ''
    } else {
      if (!config.image && config.icon) {
        const iconStyle = config.icon === 'loading' ? loadingStyle : successStyle
        this.icon.setAttribute('style', inlineStyle({
          ...iconStyle,
          ...(config.icon === 'none' ? { 'display': 'none' } : {})
        }))
        this.icon.textContent = config.icon === 'loading' ? '' : ''
      }
    }

    // toast
    this.toast.setAttribute('style', inlineStyle({
      ...toastStyle,
      ...(config.icon === 'none' ? {
        'min-height': '0',
        'padding': '10px 15px'
      } : {})
    }))

    // show
    this.el.style.display = 'block'
    // set body position fixed style
    interactiveHelper().handleAfterCreate()
    setTimeout(() => { this.el.style.opacity = '1' }, 0)
    this.type = config._type

    // disappear after duration
    config.duration >= 0 && this.hide(config.duration, this.type)

    const errMsg = this.type === 'loading' ? 'showLoading:ok' : 'showToast:ok'
    config.success && config.success({ errMsg })
    config.complete && config.complete({ errMsg })
    return Promise.resolve({ errMsg })
  }

  hide (duration = 0, type) {
    if (this.type !== type) return

    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    this.hideOpacityTimer = setTimeout(() => {
      this.el.style.opacity = '0'
      // reset body style as default
      interactiveHelper().handleBeforeDestroy()
      this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none' }, 100)
    }, duration)
  }
}
