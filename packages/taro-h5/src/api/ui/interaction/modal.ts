import { Current } from '@tarojs/runtime'

import { getCurrentPath, inlineStyle } from '../../../utils'

export default class Modal {
  options = {
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F'
  }

  style = {
    maskStyle: {
      position: 'fixed',
      'z-index': '1000',
      top: '0',
      right: '0',
      left: '0',
      bottom: '0',
      background: 'rgba(0,0,0,0.6)'
    },
    modalStyle: {
      'z-index': '4999',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      'max-width': '300px',
      'border-radius': '3px',
      'text-align': 'center',
      'line-height': '1.6',
      overflow: 'hidden',
      background: '#FFFFFF'
    },
    titleStyle: {
      padding: '20px 24px 9px',
      'font-size': '18px'
    },
    textStyle: {
      padding: '0 24px 12px',
      'min-height': '40px',
      'font-size': '15px',
      'line-height': '1.3',
      color: '#808080',
      'word-wrap': 'break-word',
      'word-break': 'break-all',
    },
    footStyle: {
      position: 'relative',
      'line-height': '48px',
      'font-size': '18px',
      display: 'flex'
    },
    btnStyle: {
      position: 'relative',
      '-webkit-box-flex': '1',
      '-webkit-flex': '1',
      flex: '1'
    }
  }

  currentPath: string | null
  el: HTMLDivElement
  title: HTMLDivElement
  text: HTMLDivElement
  cancel: HTMLDivElement
  confirm: HTMLDivElement
  hideOpacityTimer: ReturnType<typeof setTimeout>
  hideDisplayTimer: ReturnType<typeof setTimeout>

  create (options = {}) {
    return new Promise<string>((resolve) => {
      // style
      const { maskStyle, modalStyle, titleStyle, textStyle, footStyle, btnStyle } = this.style

      // configuration
      const config = {
        ...this.options,
        ...options
      }

      // wrapper
      this.el = document.createElement('div')
      this.el.className = 'taro__modal'
      this.el.style.opacity = '0'
      this.el.style.transition = 'opacity 0.2s linear'

      const eventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()
      }
      // mask
      const mask = document.createElement('div')
      mask.className = 'taro-modal__mask'
      mask.setAttribute('style', inlineStyle(maskStyle))
      mask.ontouchmove = eventHandler
      // modal
      const modal = document.createElement('div')
      modal.className = 'taro-modal__content'
      modal.setAttribute('style', inlineStyle(modalStyle))
      modal.ontouchmove = eventHandler

      // title
      const titleCSS = config.title ? titleStyle : {
        ...titleStyle,
        display: 'none'
      }
      this.title = document.createElement('div')

      this.title.className = 'taro-modal__title'
      this.title.setAttribute('style', inlineStyle(titleCSS))
      this.title.textContent = config.title

      // text
      const textCSS = config.title ? textStyle : {
        ...textStyle,
        padding: '40px 20px 26px',
        color: '#353535'
      }
      this.text = document.createElement('div')
      this.text.className = 'taro-modal__text'
      this.text.setAttribute('style', inlineStyle(textCSS))
      this.text.textContent = config.content

      // foot
      const foot = document.createElement('div')
      foot.className = 'taro-modal__foot'
      foot.setAttribute('style', inlineStyle(footStyle))

      // cancel button
      const cancelCSS = {
        ...btnStyle,
        color: config.cancelColor,
        display: config.showCancel ? 'block' : 'none'
      }
      this.cancel = document.createElement('div')
      this.cancel.className = 'taro-model__btn taro-model__cancel'
      this.cancel.setAttribute('style', inlineStyle(cancelCSS))
      this.cancel.textContent = config.cancelText
      this.cancel.onclick = () => {
        this.hide()
        resolve('cancel')
      }

      // confirm button
      this.confirm = document.createElement('div')
      this.confirm.className = 'taro-model__btn taro-model__confirm'
      this.confirm.setAttribute('style', inlineStyle(btnStyle))
      this.confirm.style.color = config.confirmColor
      this.confirm.textContent = config.confirmText
      this.confirm.onclick = () => {
        this.hide()
        resolve('confirm')
      }

      // result
      foot.appendChild(this.cancel)
      foot.appendChild(this.confirm)
      modal.appendChild(this.title)
      modal.appendChild(this.text)
      modal.appendChild(foot)
      this.el.appendChild(mask)
      this.el.appendChild(modal)

      // show immediately
      document.body.appendChild(this.el)
      setTimeout(() => { this.el.style.opacity = '1' }, 0)

      // Current.page不存在时说明路由还未挂载，此时需根据url来分配将要渲染的页面path
      this.currentPath = Current.page?.path ?? getCurrentPath()
    })
  }

  show (options = {}) {
    return new Promise<string>((resolve) => {
      const config = {
        ...this.options,
        ...options
      }

      if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
      if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

      // title & text
      const { textStyle } = this.style

      if (config.title) {
        this.title.textContent = config.title
        // none => block
        this.title.style.display = 'block'
        this.text.setAttribute('style', inlineStyle(textStyle))
      } else {
        this.title.textContent = ''
        // block => none
        this.title.style.display = 'none'
        const textCSS = {
          ...textStyle,
          padding: '40px 20px 26px',
          color: '#353535'
        }
        this.text.setAttribute('style', inlineStyle(textCSS))
      }

      this.text.textContent = config.content || ''

      // showCancel
      this.cancel.style.display = config.showCancel ? 'block' : 'none'

      // cancelText
      this.cancel.textContent = config.cancelText || ''

      // cancelColor
      this.cancel.style.color = config.cancelColor || ''

      // confirmText
      this.confirm.textContent = config.confirmText || ''

      // confirmColor
      this.confirm.style.color = config.confirmColor || ''

      // cbs
      this.cancel.onclick = () => {
        this.hide()
        resolve('cancel')
      }
      this.confirm.onclick = () => {
        this.hide()
        resolve('confirm')
      }

      // show
      this.el.style.display = 'block'
      setTimeout(() => { this.el.style.opacity = '1' }, 0)

      // Current.page不存在时说明路由还未挂载，此时需根据url来分配将要渲染的页面path
      this.currentPath = Current.page?.path ?? getCurrentPath()
    })
  }

  hide () {
    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    this.currentPath = null

    this.hideOpacityTimer = setTimeout(() => {
      this.el.style.opacity = '0'
      this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none' }, 200)
    }, 0)
  }
}
