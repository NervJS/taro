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

import * as React from 'react'
import { Image, StyleSheet, ImageSourcePropType, LayoutChangeEvent, ImageResolvedAssetSource } from 'react-native'
import { noop, omit } from '../../utils'
import ClickableSimplified from '../ClickableSimplified'
import { ImageProps, ImageState, ResizeModeMap, ResizeMode } from './PropsType'

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

export class _Image extends React.Component<ImageProps, ImageState> {
  static defaultProps: ImageProps = {
    src: '',
    mode: 'scaleToFill'
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
    const { style, src, mode = 'scaleToFill', svg = false } = this.props

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
          return this.state.layoutWidth * this.state.ratio
        } else if (typeof flattenStyle.width === 'number') {
          return flattenStyle.width * this.state.ratio
        } else {
          return 300 * this.state.ratio
        }
      } else {
        return defaultHeight
      }
    })()
    const restImageProps = omitProp(this.props)

    return (
      <Image
        testID='image'
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
