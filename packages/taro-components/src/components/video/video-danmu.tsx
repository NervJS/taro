import { Component, h, ComponentInterface, Prop, State, Host, Method } from '@stencil/core'

export interface Danmu {
  text: string
  color: string
  time: number,
  key: number,
  bottom: string
}

@Component({
  tag: 'taro-video-danmu'
})
export class VideoDanmu implements ComponentInterface {
  private list: Danmu[] = []
  private danmuElList: HTMLParagraphElement[] = []
  private currentTime = 0

  @Prop() enable = false

  @State() danmuList: Danmu[] = []

  ensureProperties (danmu: Partial<Danmu>): Danmu {
    const clonedDanmu = { ...danmu } as Danmu
    if (!('time' in danmu)) {
      clonedDanmu.time = this.currentTime
    }
    clonedDanmu.key = Math.random()
    clonedDanmu.bottom = `${Math.random() * 90 + 5}%`
    return clonedDanmu
  }

  @Method()
  async sendDanmu (danmuList: Partial<Danmu> | Partial<Danmu>[] = []) {
    if (Array.isArray(danmuList)) {
      this.list = [
        ...this.list,
        ...danmuList.map(danmu => this.ensureProperties(danmu))
      ]
    } else {
      const danmu = danmuList
      this.list = [
        ...this.list,
        { ...this.ensureProperties(danmu) }
      ]
    }
  }

  @Method()
  async tick (currentTime: number) {
    this.currentTime = currentTime

    if (!this.enable) return

    const danmuList = this.list

    /**
     * @todo 这个判断对拖拽进度的处理不严谨
     */
    const newDanmuList = danmuList.filter(({ time }) => {
      return currentTime - time < 4 && currentTime > time
    })
    let shouldUpdate = false
    const oldDanmuList = this.danmuList

    if (newDanmuList.length !== oldDanmuList.length) {
      shouldUpdate = true
    } else {
      shouldUpdate = newDanmuList.some(({ key }) => {
        return oldDanmuList.every((danmu) => {
          return key !== danmu.key
        })
      })
    }
    if (shouldUpdate) {
      this.danmuList = newDanmuList
    }
  }

  componentDidUpdate () {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const danmuElList = this.danmuElList.splice(0)
        danmuElList.forEach(danmu => {
          danmu.style.left = '0'
          danmu.style.webkitTransform = 'translateX(-100%)'
          danmu.style.transform = 'translateX(-100%)'
        })
      })
    })
  }

  render () {
    if (!this.enable) return ''

    return (
      <Host class='taro-video-danmu'>
        {this.danmuList.map(({ text, color, bottom, key }) => (
          <p
            class='taro-video-danmu-item'
            key={key}
            style={{
              color,
              bottom
            }}
            ref={ref => {
              if (ref) {
                this.danmuElList.push(ref)
              }
            }}
          >
            {text}
          </p>
        ))}
      </Host>
    )
  }
}
