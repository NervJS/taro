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
import { noop, omit } from '../../utils'
import ClickableSimplified from '../ClickableSimplified'
import { ImageProps, ImageState, Mode, ResizeModeMap, ResizeMode } from './PropsType'

const resizeModeMap: ResizeModeMap = {
  scaleToFill: 'stretch',
  aspectFit: 'contain',
  aspectFill: 'cover',
  center: 'center'
  // And widthFix
  // Not supported value...
}

export class _Image extends React.Component<ImageProps, ImageState> {
  static defaultProps = {
    src: '',
    mode: Mode.ScaleToFill
  }

  hasLayout = false

  state: ImageState = {
    ratio: 0,
    layoutWidth: 0
  }

  onError = (): void => {
    const { onError = noop } = this.props
    onError({
      detail: { errMsg: 'something wrong' }
    })
  }

  onLoad = (): void => {
    const { src, onLoad } = this.props
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
  }

  onLayout = (event: LayoutChangeEvent): void => {
    const { mode, style } = this.props
    const { width: layoutWidth } = event.nativeEvent.layout
    const flattenStyle = StyleSheet.flatten(style) || {}
    if (mode === 'widthFix' && typeof flattenStyle.width === 'string') {
      if (this.hasLayout) return
      this.setState({
        layoutWidth
      })
    }
    if (this.state.ratio) {
      this.hasLayout = true
    }
  }

  loadImg = (props: ImageProps): void => {
    const { mode, src } = props
    if (mode !== 'widthFix') return
    if (typeof src === 'string') {
      Image.getSize(
        props.src,
        (width, height) => {
          if (this.hasLayout) return
          this.setState({
            ratio: height / width
          })
        }
      )
    } else {
      const source = typeof props.src === 'string' ? { uri: props.src } : props.src
      const { width, height }: { width: number; height: number } = Image.resolveAssetSource(source) || {}
      if (this.hasLayout && !!this.state.ratio) return
      this.setState({
        ratio: height / width
      })
    }
  }

  componentDidMount(): void {
    this.loadImg(this.props)
  }

  shouldComponentUpdate(nextProps: ImageProps): boolean {
    if (nextProps.src !== this.props.src) {
      this.hasLayout = false
    }
    return true
  }

  componentDidUpdate(prevProps: ImageProps): void {
    if (prevProps.src !== this.props.src) {
      this.loadImg(this.props)
    }
  }

  render(): JSX.Element {
    const { style, src, mode } = this.props

    const flattenStyle = StyleSheet.flatten(style) || {}

    // The parameter passed to require mpxTransformust be a string literal
    const source: ImageSourcePropType = typeof src === 'string' ? { uri: src } : src

    const isWidthFix = mode === 'widthFix'
    // @ts-ignore
    const rMode: ResizeMode = (resizeModeMap[mode] || (isWidthFix ? undefined : 'stretch')) as ResizeMode

    const imageHeight = (() => {
      if (isWidthFix) {
        if (typeof flattenStyle.width === 'string') {
          return this.state.layoutWidth * this.state.ratio
        } else if (typeof flattenStyle.width === 'number') {
          return flattenStyle.width * this.state.ratio
        } else {
          return 300 * this.state.ratio
        }
      } else {
        return flattenStyle.height || 225
      }
    })()
    const restImageProps = omit(this.props, ['source', 'src', 'resizeMode', 'onLoad', 'onError', 'onLayout', 'style'])

    return (
      <Image
        source={source}
        resizeMode={rMode}
        onError={this.onError}
        onLoad={this.onLoad}
        onLayout={this.onLayout}
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
}

// export { _Image }
export default ClickableSimplified(_Image)
// export default _Image
