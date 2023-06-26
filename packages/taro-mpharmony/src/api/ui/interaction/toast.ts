import { Current } from '@tarojs/runtime'

import { getCurrentPath, inlineStyle } from '../../../utils'

export default class Toast {
  options = {
    title: '',
    icon: 'none',
    image: '',
    duration: 1500,
    mask: false
  }

  style = {
    maskStyle: {
      position: 'fixed',
      'z-index': '1000',
      top: '0',
      right: '0',
      left: '0',
      bottom: '0'
    },
    toastStyle: {
      'z-index': '5000',
      'box-sizing': 'border-box',
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      '-webkit-justify-content': 'center',
      position: 'fixed',
      top: '50%',
      left: '50%',
      'min-width': '120px',
      'max-width': '200px',
      'min-height': '120px',
      padding: '15px',
      transform: 'translate(-50%, -50%)',
      'border-radius': '5px',
      'text-align': 'center',
      'line-height': '1.6',
      color: '#FFFFFF',
      background: 'rgba(17, 17, 17, 0.7)'
    },
    successStyle: {
      margin: '6px auto',
      width: '38px',
      height: '38px',
      background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB0PSIxNjM5NTQ4OTYzMjA0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQzNDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMjE5Ljk1MiA1MTIuNTc2bDIxMC40MzIgMjEwLjQzMi00NS4yNDggNDUuMjU2LTIxMC40MzItMjEwLjQzMnoiIHAtaWQ9IjQzNDkiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNzk5LjY3MiAyNjIuMjY0bDQ1LjI1NiA0NS4yNTYtNDYwLjQ2NCA0NjAuNDY0LTQ1LjI1Ni00NS4yNTZ6IiBwLWlkPSI0MzUwIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+) no-repeat',
      'background-size': '100%'
    },
    errrorStyle: {
      margin: '6px auto',
      width: '38px',
      height: '38px',
      background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB0PSIxNjM5NTUxMDU1MTgzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MDc2IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNTggNjQgNjQgMjY0LjU4IDY0IDUxMnMyMDAuNTggNDQ4IDQ0OCA0NDggNDQ4LTIwMC41OCA0NDgtNDQ4Uzc1OS40MiA2NCA1MTIgNjR6IG0wIDc1MmEzNiAzNiAwIDEgMSAzNi0zNiAzNiAzNiAwIDAgMS0zNiAzNnogbTUxLjgzLTU1MS45NUw1NDggNjM2YTM2IDM2IDAgMCAxLTcyIDBsLTE1LjgzLTM3MS45NWMtMC4xLTEuMzMtMC4xNy0yLjY4LTAuMTctNC4wNWE1MiA1MiAwIDAgMSAxMDQgMGMwIDEuMzctMC4wNyAyLjcyLTAuMTcgNC4wNXoiIHAtaWQ9IjE0MDc3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+) no-repeat',
      'background-size': '100%'
    },
    loadingStyle: {
      margin: '6px auto',
      width: '38px',
      height: '38px',
      '-webkit-animation': 'taroLoading 1s steps(12, end) infinite',
      animation: 'taroLoading 1s steps(12, end) infinite',
      background: 'transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat',
      'background-size': '100%'
    },
    imageStyle: {
      margin: '6px auto',
      width: '40px',
      height: '40px',
      background: 'transparent no-repeat',
      'background-size': '100%'
    },
    textStyle: {
      margin: '0',
      'font-size': '16px'
    }
  }

  currentPath: string | null
  el: HTMLDivElement
  mask: HTMLDivElement
  icon: HTMLParagraphElement
  toast: HTMLDivElement
  title: HTMLParagraphElement
  type: any
  hideOpacityTimer: ReturnType<typeof setTimeout>
  hideDisplayTimer: ReturnType<typeof setTimeout>

  create (options = {}, _type: 'loading' | 'toast' = 'toast') {
    // style
    const { maskStyle, toastStyle, successStyle, errrorStyle, loadingStyle, imageStyle, textStyle } = this.style

    // configuration
    const config = {
      ...this.options,
      ...options,
      _type
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
      const iconStyle = config.icon === 'loading' ? loadingStyle : config.icon === 'error' ? errrorStyle : successStyle
      this.icon.setAttribute('style', inlineStyle({
        ...iconStyle,
        ...(config.icon === 'none' ? { display: 'none' } : {})
      }))
    }

    // toast
    this.toast = document.createElement('div')
    this.toast.setAttribute('style', inlineStyle({
      ...toastStyle,
      ...(config.icon === 'none' ? {
        'min-height': '0',
        padding: '10px 15px'
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
    setTimeout(() => { this.el.style.opacity = '1' }, 0)
    this.type = config._type

    // disappear after duration
    config.duration >= 0 && this.hide(config.duration, this.type)

    // Current.page不存在时说明路由还未挂载，此时需根据url来分配将要渲染的页面path
    this.currentPath = Current.page?.path ?? getCurrentPath()

    return ''
  }

  show (options = {}, _type: 'loading' | 'toast' = 'toast') {
    const config = {
      ...this.options,
      ...options,
      _type
    }

    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    // title
    this.title.textContent = config.title || ''

    // mask
    this.mask.style.display = config.mask ? 'block' : 'none'

    // image
    const { toastStyle, successStyle, errrorStyle, loadingStyle, imageStyle } = this.style
    if (config.image) {
      this.icon.setAttribute('style', inlineStyle({
        ...imageStyle,
        'background-image': `url(${config.image})`
      }))
    } else {
      if (!config.image && config.icon) {
        const iconStyle = config.icon === 'loading' ? loadingStyle : config.icon === 'error' ? errrorStyle : successStyle
        this.icon.setAttribute('style', inlineStyle({
          ...iconStyle,
          ...(config.icon === 'none' ? { display: 'none' } : {})
        }))
      }
    }

    // toast
    this.toast.setAttribute('style', inlineStyle({
      ...toastStyle,
      ...(config.icon === 'none' ? {
        'min-height': '0',
        padding: '10px 15px'
      } : {})
    }))

    // show
    this.el.style.display = 'block'
    setTimeout(() => { this.el.style.opacity = '1' }, 0)
    this.type = config._type

    // disappear after duration
    config.duration >= 0 && this.hide(config.duration, this.type)

    // Current.page不存在时说明路由还未挂载，此时需根据url来分配将要渲染的页面path
    this.currentPath = Current.page?.path ?? getCurrentPath()

    return ''
  }

  hide (duration = 0, type = '') {
    if (type && type !== this.type) return

    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    this.currentPath = null

    this.hideOpacityTimer = setTimeout(() => {
      this.el.style.opacity = '0'
      this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none' }, 100)
    }, duration)
  }
}
