import './style/index.css'

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
    ...reset
  } = props
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
