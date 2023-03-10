/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { Component, h, Host, Prop, Element } from '@stencil/core'

@Component({
  tag: 'taro-movable-area-core',
  styleUrl: './area.scss'
})
export class MovableArea {

  /** 
   * 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个movable-area
   */
  @Prop() scaleArea: boolean

  @Element() element: HTMLElement

  /** 观察者 */
  private observer?: MutationObserver
  /** 子元素集合 */
  private views: Array<HTMLElement> = []
  /** 单个元素缩放时的目标元素 */
  private scaleTarget?: HTMLElement
  /** 手势缩放 */
  private scaleLength: number = 0
  /** 宽高 */
  private offset?: { width: number; height: number; }

  connectedCallback () {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class" || mutation.attributeName === "style") {
          const offsetWidth = this.element.offsetWidth
          const offsetHeight = this.element.offsetHeight
          if (offsetWidth !== this.offset?.width || offsetHeight !== this.offset?.height) {
            this.updateArea()
          }
          this.offset = {
            width: offsetWidth,
            height: offsetHeight
          }
        }
      })
    })

    this.observer.observe(this.element, {
      attributes: true
    })
  }

  disconnectedCallback () {
    this.observer?.disconnect()
  }

  componentDidLoad () {
    this.viewsChanged()
  }

  viewsChanged = () => {
    this.views = []
    const elements = this.element.querySelectorAll('taro-movable-view-core')
    Array.from(elements).forEach((element) => {
      this.views.push(element)
    })
    this.updateArea()
  }

  handleTouchStart = (e: TouchEvent) => {
    const touches = e.touches
    if (!touches || touches.length <= 1) {
      return
    }

    const gap = {
      width: touches[1].pageX - touches[0].pageX,
      height: touches[1].pageY - touches[0].pageY
    }
    this.scaleLength = Math.sqrt(gap.width * gap.width + gap.height * gap.height)
    if (this.scaleArea) {
      return
    }

    const find = (target: EventTarget, views: Array<HTMLElement>) => {
      const loop = (e, t) => {
        if (!(e = e.parentNode)) {
          return false
        }
        return (!(e instanceof HTMLElement) || e !== document.body) && (e === t || e === t.element || e.element === t || loop(e, t))
      }

      for (let i = 0; i < views.length; i++) {
        const view = views[i]
        if (target === view["element"] || loop(target, view)) {
          return view
        }
      }
    }

    const touch1 = find(touches[0].target, this.views)
    const touch2 = find(touches[1].target, this.views)
    this.scaleTarget = touch1 && touch1 === touch2 ? touch1 : undefined
  }

  handleTouchMove = (e: TouchEvent) => {
    const touches = e.touches
    if (!touches || touches.length <= 1) {
      return
    }
    e.preventDefault()
    const gap = {
      width: touches[1].pageX - touches[0].pageX,
      height: touches[1].pageY - touches[0].pageY
    }
    if (this.scaleLength > 0) {
      this.updateScale(Math.sqrt(gap.width * gap.width + gap.height * gap.height) / this.scaleLength)
    }
  }

  handleTouchEnd = (e: TouchEvent) => {
    if ((e.touches && e.touches.length) || !e.changedTouches) {
      return
    }
    this.scaleLength = 0
    if (this.scaleArea) {
      this.views.forEach((element) => {
        element["endScale"]?.()
      })
    } else {
      this.scaleTarget?.["endScale"]?.()
    }
    this.scaleTarget = undefined
  }

  updateScale = (scale: number) => {
    if (!scale || scale === 1) {
      return
    }

    if (this.scaleArea) {
      this.views.forEach((element) => {
        element["setScale"]?.(scale)
      })
    } else {
      this.scaleTarget?.["setScale"]?.(scale)
    }
  }

  updateArea = () => {
    const computedStyle = window.getComputedStyle(this.element)
    const clientRect = this.element.getBoundingClientRect()
    const horizontal = ["Left", "Right"].map((e) => {
      return parseFloat(computedStyle["border" + e + "Width"]) + parseFloat(computedStyle["padding" + e])
    })
    const vertical = ["Top", "Bottom"].map((e) => {
      return parseFloat(computedStyle["border" + e + "Width"]) + parseFloat(computedStyle["padding" + e])
    })

    this.views.forEach((element) => {
      element["setParent"]?.({
        element: this.element,
        area: {
          height: clientRect.height - vertical[0] - vertical[1],
          width: clientRect.width - horizontal[0] - horizontal[1]
        }
      })
    })
  }

  render () {
    return (
      <Host
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      />
    )
  }
}
