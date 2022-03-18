import { inlineStyle, setTransform } from '../../utils'

const noop = function () {}

export default class ActionSheet {
  options = {
    itemList: [],
    itemColor: '#000000',
    success: noop,
    fail: noop,
    complete: noop
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
    actionSheetStyle: {
      'z-index': '4999',
      position: 'fixed',
      left: '0',
      bottom: '0',
      '-webkit-transform': 'translate(0, 100%)',
      transform: 'translate(0, 100%)',
      width: '100%',
      'line-height': '1.6',
      background: '#EFEFF4',
      '-webkit-transition': '-webkit-transform .3s',
      transition: 'transform .3s'
    },
    menuStyle: {
      'background-color': '#FCFCFD'
    },
    cellStyle: {
      position: 'relative',
      padding: '10px 0',
      'text-align': 'center',
      'font-size': '18px'
    },
    cancelStyle: {
      'margin-top': '6px',
      padding: '10px 0',
      'text-align': 'center',
      'font-size': '18px',
      color: '#000000',
      'background-color': '#FCFCFD'
    }
  }

  lastConfig = {}
  el: HTMLDivElement
  actionSheet: HTMLDivElement
  menu: HTMLDivElement
  cells: HTMLDivElement[]
  cancel: HTMLDivElement
  hideOpacityTimer: any
  hideDisplayTimer: any

  create (options = {}) {
    return new Promise<string | number>((resolve) => {
      // style
      const { maskStyle, actionSheetStyle, menuStyle, cellStyle, cancelStyle } = this.style

      // configuration
      const config = {
        ...this.options,
        ...options
      }

      this.lastConfig = config

      // wrapper
      this.el = document.createElement('div')
      this.el.className = 'taro__actionSheet'
      this.el.style.opacity = '0'
      this.el.style.transition = 'opacity 0.2s linear'

      // mask
      const mask = document.createElement('div')
      mask.setAttribute('style', inlineStyle(maskStyle))

      // actionSheet
      this.actionSheet = document.createElement('div')
      this.actionSheet.setAttribute('style', inlineStyle(actionSheetStyle))

      // menu
      this.menu = document.createElement('div')
      this.menu.setAttribute('style', inlineStyle({
        ...menuStyle,
        color: config.itemColor
      }))

      // cells
      this.cells = config.itemList.map((item, index) => {
        const cell: HTMLDivElement = document.createElement('div')
        cell.className = 'taro-actionsheet__cell'
        cell.setAttribute('style', inlineStyle(cellStyle))
        cell.textContent = item
        cell.dataset.tapIndex = `${index}`
        cell.onclick = e => {
          this.hide()
          const target = e.currentTarget as HTMLDivElement
          const index = Number(target?.dataset.tapIndex) || 0
          resolve(index)
        }
        return cell
      })

      // cancel
      this.cancel = document.createElement('div')
      this.cancel.setAttribute('style', inlineStyle(cancelStyle))
      this.cancel.textContent = '取消'

      // result
      this.cells.forEach(item => this.menu.appendChild(item))
      this.actionSheet.appendChild(this.menu)
      this.actionSheet.appendChild(this.cancel)
      this.el.appendChild(mask)
      this.el.appendChild(this.actionSheet)

      // callbacks
      const cb = () => {
        this.hide()
        resolve('cancel')
      }
      mask.onclick = cb
      this.cancel.onclick = cb

      // show immediately
      document.body.appendChild(this.el)
      setTimeout(() => {
        this.el.style.opacity = '1'
        setTransform(this.actionSheet, 'translate(0, 0)')
      }, 0)
    })
  }

  show (options = {}) {
    return new Promise<string | number>((resolve) => {
      const config = {
        ...this.options,
        ...options
      }

      this.lastConfig = config

      if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
      if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

      // itemColor
      if (config.itemColor) this.menu.style.color = config.itemColor

      // cells
      const { cellStyle } = this.style

      config.itemList.forEach((item, index) => {
        let cell: HTMLDivElement
        if (this.cells[index]) {
          // assign new content
          cell = this.cells[index]
        } else {
          // create new cell
          cell = document.createElement('div')
          cell.className = 'taro-actionsheet__cell'
          cell.setAttribute('style', inlineStyle(cellStyle))
          cell.dataset.tapIndex = `${index}`
          this.cells.push(cell)
          this.menu.appendChild(cell)
        }
        cell.textContent = item
        cell.onclick = e => {
          this.hide()
          const target = e.currentTarget as HTMLDivElement
          const index = Number(target?.dataset.tapIndex) || 0
          resolve(index)
        }
      })
      const cellsLen = this.cells.length
      const itemListLen = config.itemList.length
      if (cellsLen > itemListLen) {
        for (let i = itemListLen; i < cellsLen; i++) {
          this.menu.removeChild(this.cells[i])
        }
        this.cells.splice(itemListLen)
      }

      // show
      this.el.style.display = 'block'
      setTimeout(() => {
        this.el.style.opacity = '1'
        setTransform(this.actionSheet, 'translate(0, 0)')
      }, 0)
    })
  }

  hide () {
    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer)
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer)

    this.hideOpacityTimer = setTimeout(() => {
      this.el.style.opacity = '0'
      setTransform(this.actionSheet, 'translate(0, 100%)')
      this.hideDisplayTimer = setTimeout(() => { this.el.style.display = 'none' }, 200)
    }, 0)
  }
}
