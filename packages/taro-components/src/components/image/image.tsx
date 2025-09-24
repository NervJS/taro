import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

export type Mode =
  'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'

// CDN脚本URL（按环境与可覆盖配置）
const LEGO_CDN_URL_DEV = 'http://ossin.jd.com/swm-plus/h5Tag/tag.js'
const LEGO_CDN_URL_PROD = 'https://storage.jd.com/static-frontend/h5-tag/1.0.0/tag.min.js'

const getLegoCdnUrl = (): string => {
  // 允许通过全局变量覆盖
  const override = (typeof window !== 'undefined' && (window as any).__TARO_IMAGE_LEGO_CDN_URL__)
  if (override && typeof override === 'string') return override

  // 允许通过 Taro 全局对象覆盖（与 window 同名变量）
  const taroOverride = (typeof window !== 'undefined' && (window as any).Taro && (window as any).Taro.__TARO_IMAGE_LEGO_CDN_URL__)
  if (taroOverride && typeof taroOverride === 'string') return taroOverride

  // 基于环境选择
  const isProd = (typeof process !== 'undefined' && (process as any).env && (process as any).env.NODE_ENV === 'production')
  return isProd ? LEGO_CDN_URL_PROD : LEGO_CDN_URL_DEV
}

// 检查CDN脚本是否已加载
const isLegoScriptLoaded = (): boolean => {
  const url = getLegoCdnUrl()
  return document.querySelector(`script[src="${url}"]`) !== null
}

// 插入CDN脚本
const insertLegoScript = (): void => {
  if (typeof document === 'undefined') return
  if (isLegoScriptLoaded()) return

  const script = document.createElement('script')
  script.type = 'module'
  script.src = getLegoCdnUrl()
  document.head.appendChild(script)
}

// 解析lego协议URL
const parseLegoUrl = (src: string): { tagId: string; text: string } | null => {
  const LEGO_PROTOCOL = 'lego://'
  if (!src.startsWith(LEGO_PROTOCOL)) return null

  try {
    // 移除 'lego://' 前缀
    const urlWithoutProtocol = src.slice(LEGO_PROTOCOL.length)

    // 分割tagId和参数
    const [tagId, params] = urlWithoutProtocol.split('?')

    // 解析参数
    const text = params ? new URLSearchParams(params).get('text') || '' : ''

    return { tagId, text }
  } catch (error) {
    console.warn('Failed to parse lego URL:', src, error)
    return null
  }
}

@Component({
  tag: 'taro-image-core',
  styleUrl: './style/index.scss'
})
export class Image implements ComponentInterface {
  @Prop() src: string
  @Prop() mode: Mode = 'scaleToFill'
  @Prop() lazyLoad = false
  @Prop() nativeProps = {}
  @Prop() lang: string

  @State() aspectFillMode = 'width'
  @State() didLoad = false

  @Event({
    eventName: 'load'
  }) onLoad: EventEmitter

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  private imgRef: HTMLImageElement

  componentDidLoad () {
    // 检查是否为lego模式，如果是则确保CDN脚本已加载
    const legoData = parseLegoUrl(this.src)
    if (legoData !== null) {
      insertLegoScript()
    }

    if (!this.lazyLoad) return

    const lazyImg = new IntersectionObserver(entries => {
      // 异步 api 关系
      if (entries[entries.length - 1].isIntersecting) {
        lazyImg.unobserve(this.imgRef)
        this.didLoad = true
      }
    }, {
      rootMargin: '300px 0px'
    })

    lazyImg.observe(this.imgRef)
  }

  imageOnLoad () {
    const {
      width,
      height,
      naturalWidth,
      naturalHeight
    } = this.imgRef

    this.onLoad.emit({
      width,
      height
    })

    this.aspectFillMode = naturalWidth > naturalHeight ? 'width' : 'height'
  }

  imageOnError (e: Event) {
    this.onError.emit(e)
  }

  render () {
    const {
      src,
      lazyLoad = false,
      aspectFillMode = 'width',
      imageOnLoad,
      imageOnError,
      nativeProps,
      didLoad,
      lang
    } = this
    // mode="" 按默认值处理
    const mode = this.mode || 'scaleToFill'

    // 检查是否为lego模式
    const legoData = parseLegoUrl(src)
    const isLegoMode = legoData !== null

    const cls = classNames({
      'taro-img__widthfix': mode === 'widthFix'
    })
    const imgCls = classNames(
      `taro-img__mode-${mode.toLowerCase().replace(/\s/g, '')}`,
      {
        [`taro-img__mode-aspectfill--${aspectFillMode}`]: mode === 'aspectFill'
      }
    )

    // 如果是lego模式，渲染canvas-tag
    if (isLegoMode && legoData) {
      return (
        <Host class={cls}>
          <canvas-tag
            tagId={legoData.tagId}
            text={legoData.text}
            lang={lang}
            {...nativeProps}
          />
        </Host>
      )
    }

    // 普通图片模式
    return (
      <Host class={cls}>
        {
          src ? (
            <img
              ref={(img) => (this.imgRef = img!)}
              class={imgCls}
              src={lazyLoad && !didLoad ? undefined : src}
              onLoad={imageOnLoad.bind(this)}
              onError={imageOnError.bind(this)}
              {...nativeProps} />
          ) : ''
        }
      </Host>
    )
  }
}
