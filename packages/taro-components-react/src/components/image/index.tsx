import './style/index.scss'

import classNames from 'classnames'

import { createForwardRefComponent } from '../../utils'
import { useCallback, useEffect, useRef, useState } from '../../utils/hooks'

import type React from 'react'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  mode: string
  onError: () => void
  onLoad: (e) => void
  lazyLoad?: boolean
  imgProps?: Record<string, any>
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
  lang?: string
}

// CDN脚本URL
const LEGO_CDN_URL = 'http://ossin.jd.com/swm-plus/h5Tag/tag.js'

// 检查CDN脚本是否已加载
const isLegoScriptLoaded = (): boolean => {
  return document.querySelector(`script[src="${LEGO_CDN_URL}"]`) !== null
}

// 插入CDN脚本
const insertLegoScript = (): void => {
  if (isLegoScriptLoaded()) return

  const script = document.createElement('script')
  script.type = 'module'
  script.src = LEGO_CDN_URL
  document.head.appendChild(script)
}

// 解析lego协议URL
const parseLegoUrl = (src: string): { tagId: string, text: string } | null => {
  if (!src.startsWith('lego://')) return null

  try {
    // 移除 'lego://' 前缀
    const urlWithoutProtocol = src.substring(7)

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

function Image (props: IProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const observer = useRef<Partial<IntersectionObserver>>({})
  const [, setIsLoaded] = useState(false)
  const {
    className,
    style = {},
    src,
    mode,
    onError,
    lazyLoad,
    imgProps,
    forwardedRef,
    lang,
    ...reset
  } = props

  // 检查是否为lego模式
  const legoData = parseLegoUrl(src)
  const isLegoMode = legoData !== null

  // 如果是lego模式，确保CDN脚本已加载
  useEffect(() => {
    if (isLegoMode) {
      insertLegoScript()
    }
  }, [isLegoMode])

  const cls = classNames(
    'taro-img',
    {
      'taro-img__widthfix': mode === 'widthFix'
    },
    className
  )
  const imgCls = classNames(
    'taro-img__mode-' +
      (mode || 'scaleToFill').toLowerCase().replace(/\s/g, '')
  )

  const imageOnLoad = useCallback((e) => {
    const { onLoad } = props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      writable: true,
      value: {
        width: e.target.width,
        height: e.target.height
      }
    })

    onLoad && onLoad(e)
  }, [props])

  useEffect(() => {
    if (lazyLoad) {
      observer.current = new IntersectionObserver(
        entries => {
          // 异步 api 关系
          if (entries[entries.length - 1].isIntersecting) {
            setIsLoaded(true)
            // findDOMNode(this).children[0].src = src
            imgRef.current!.src = src
          }
        },
        {
          rootMargin: '300px 0px'
        }
      )
      observer.current.observe?.(imgRef.current!)
    }

    return () => {
      observer.current?.disconnect?.()
    }
  }, [lazyLoad, src])

  // 如果是lego模式，渲染canvas-tag
  if (isLegoMode && legoData) {
    return (
      <div className={cls} style={style} ref={forwardedRef} {...reset}>
        <canvas-tag
          tagId={legoData.tagId}
          text={legoData.text}
          lang={lang}
          {...imgProps}
        />
      </div>
    )
  }

  // 普通图片模式
  return (
    <div className={cls} style={style} ref={forwardedRef} {...reset}>
      {lazyLoad ? (
        <img
          ref={img => (imgRef.current = img)}
          className={imgCls}
          data-src={src}
          onLoad={imageOnLoad}
          onError={onError}
          {...imgProps}
        />
      ) : (
        <img
          ref={img => (imgRef.current = img)}
          className={imgCls}
          src={src}
          onLoad={imageOnLoad}
          onError={onError}
          {...imgProps}
        />
      )}
    </div>
  )
}

export default createForwardRefComponent(Image)
