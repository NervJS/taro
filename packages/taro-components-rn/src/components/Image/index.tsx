/**
 * ✔ src
 * ✔ mode: Partial support
 * ✘ lazy-load
 * ✔ onError(binderror)
 * ✔ onLoad(bindload)
 * ✘ onClick
 * ✔ DEFAULT_SIZE
 *
 * @warn Pass require(LOCAL IMAGE) to SRC, otherwise a string-type parameter.
 * @warn The width/height would be undefined in onLoad.
 * @warn Avoid using HTTP source image.
 * @warn Image.resolveAssetSource 会造成重复请求
 * @warn 宽高为 0 的时候，不触发 onLoad，跟小程序不同
 */
import * as React from 'react'
import { Image, StyleSheet, ImageSourcePropType, LayoutChangeEvent, ImageResolvedAssetSource } from 'react-native'
import { omit } from '../../utils'
import { ImageProps, ResizeModeMap, ResizeMode } from './PropsType'
import { useCallback, useEffect, useRef, useState } from 'react'
import useClickable from '../hooks/useClickable'
import { ClickableProps } from '../hooks/PropsType'

// fix: https://github.com/facebook/metro/issues/836
// 保证 react-native-svg 是最后一个依赖
const omitProp = (props) => {
  return omit(props, ['source', 'src', 'resizeMode', 'onLoad', 'onError', 'onLayout', 'style'])
}

const resizeModeMap: ResizeModeMap = {
  scaleToFill: 'stretch',
  aspectFit: 'contain',
  aspectFill: 'cover',
  center: 'center',
  // And widthFix
  // Not supported value...
}

let SvgCssUri, WithLocalSvg
// react-native-svg is optional
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const svg = require('react-native-svg')
  SvgCssUri = svg.SvgCssUri
  WithLocalSvg = svg.WithLocalSvg
} catch (e) {}

const _Image: React.ComponentType<ImageProps & ClickableProps> = (props: ImageProps = {
  src: '',
  mode: 'scaleToFill'
}) => {
  const ref = useRef({
    hasLayout: false
  })

  const [ratio, setRatio] = useState(0)
  const [layoutWidth, setLayoutWidth] = useState(0)
  const newProps = useClickable(props)
  const { style, src, mode = 'scaleToFill', svg = false, onLoad, onError } = newProps

  const _onError = useCallback(() => {
    if (!onError) return
    onError({
      detail: { errMsg: 'something wrong' }
    })
  }, [onError])

  const _onLoad = useCallback((): void => {
    if (!onLoad) return
    if (typeof src === 'string') {
      Image.getSize(
        src as string,
        (width: number, height: number) => {
          onLoad({
            detail: { width, height }
          })
        },
        () => {
          onLoad({
            detail: { width: 0, height: 0 }
          })
        }
      )
    } else {
      const iras: ImageResolvedAssetSource = Image.resolveAssetSource(typeof src === 'string' ? { uri: src } : src)
      const { width, height }: { width: number; height: number } = iras || { width: 0, height: 0 }
      onLoad({
        detail: { width, height }
      })
    }
  }, [onLoad])

  const onLayout = (event: LayoutChangeEvent): void => {
    const { width: layoutWidth } = event.nativeEvent.layout
    const flattenStyle = StyleSheet.flatten(style) || {}
    if (mode === 'widthFix' && typeof flattenStyle.width === 'string') {
      if (ref.current.hasLayout) return
      setLayoutWidth(layoutWidth)
    }
    if (ratio) {
      ref.current.hasLayout = true
    }
  }

  const loadImg = useCallback((props: ImageProps): void => {
    if (mode !== 'widthFix') return
    if (typeof src === 'string') {
      Image.getSize(
        props.src,
        (width, height) => {
          if (ref.current.hasLayout) return
          setRatio(height / width)
        }
      )
    } else {
      const source = typeof props.src === 'string' ? { uri: props.src } : props.src
      const { width, height }: { width: number; height: number } = Image.resolveAssetSource(source) || {}
      if (ref.current.hasLayout && !!ratio) return
      setRatio(height / width)
    }
  }, [mode, src, ref])

  useEffect(() => {
    ref.current.hasLayout = false
    loadImg(props)
  }, [props.src, ref])

  const flattenStyle = StyleSheet.flatten(style) || {}

  const defaultWidth = flattenStyle.width || 300
  const defaultHeight = flattenStyle.height || 225

  // remote svg image support, svg 图片暂不支持 mode
  const remoteSvgReg = /(https?:\/\/.*\.(?:svg|svgx))/i
  if (SvgCssUri && typeof src === 'string' && remoteSvgReg.test(src)) {
    return (
      <SvgCssUri
        uri={src}
        width={defaultWidth}
        height={defaultHeight}
      />
    )
  }

  // The parameter passed to require mpxTransformust be a string literal
  const source: ImageSourcePropType = typeof src === 'string' ? { uri: src } : src

  // local svg image support, svg 图片暂不支持 mode
  if (WithLocalSvg && svg) {
    return (
      <WithLocalSvg
        asset={source}
        width={defaultWidth}
        height={defaultHeight}
      />
    )
  }

  const isWidthFix = mode === 'widthFix'
  const rMode: ResizeMode = (resizeModeMap[mode] || (isWidthFix ? undefined : 'stretch'))

  const imageHeight = (() => {
    if (isWidthFix) {
      if (typeof flattenStyle.width === 'string') {
        return layoutWidth * ratio
      } else if (typeof flattenStyle.width === 'number') {
        return flattenStyle.width * ratio
      } else {
        return 300 * ratio
      }
    } else {
      return defaultHeight
    }
  })()
  const restImageProps = omitProp(newProps)

  return (
    <Image
      testID='image'
      source={source}
      resizeMode={rMode}
      onError={_onError}
      onLoad={_onLoad}
      onLayout={onLayout}
      style={[
        {
          width: 300
        },
        style,
        {
          height: imageHeight
        }
      ]}
      {...restImageProps}
    />
  )
}

export { _Image }
export default _Image
