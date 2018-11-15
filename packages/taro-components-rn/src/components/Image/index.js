/**
 * ✔ src
 * ✔ mode: Partial support
 * ✘ lazy-load
 * ✔ onError(binderror)
 * ✔ onLoad(bindload)
 * ✔ onClick
 * ✔ DEFAULT_SIZE
 *
 * @warn Pass require(LOCAL IMAGE) to SRC, otherwise a string-type parameter.
 * @warn The width/height would be undefined in onLoad.
 * @warn Avoid using HTTP source image.
 * @warn unstable
 *
 * @flow
 */

import * as React from 'react'
import {
  Image,
  StyleSheet,
} from 'react-native'
import Clickable from '../_Clickable'

const resizeModeMap: Object = {
  scaleToFill: 'stretch',
  aspectFit: 'contain',
  aspectFill: 'cover',
  center: 'center',
  // And widthFix
  // Not supported value...
}

type Props = {
  style?: StyleSheet.Styles,
  src?: string,
  mode: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right',
  onError?: Function,
  onLoad?: Function,
}

type State = {
  // height:width
  ratio: number,
  layoutWidth: number
}

class _Image extends React.Component<Props, State> {
  props: Props
  hasLayout: boolean = true
  state: State = {
    ratio: 0,
    layoutWidth: 0
  }

  static defaultProps = {
    mode: 'scaleToFill',
  }

  onError = (event: Object) => {
    const { onError } = this.props
    onError && onError({
      detail: { errMsg: 'something wrong' }
    })
  }

  onLoad = (event: Object) => {
    const { src, onLoad } = this.props
    // const { width, height } = Image.resolveAssetSource(typeof src === 'string' && /^(https?:)?\/\//.test(src) ? { uri: src } : src)
    const { width, height } = Image.resolveAssetSource(typeof src === 'string' ? { uri: src } : src)
    onLoad && onLoad({
      detail: { width, height }
    })
  }

  onLayout = (event: Object) => {
    const { width: layoutWidth } = event.nativeEvent.layout
    this.setState({
      layoutWidth
    })
  }

  loadImg = (props: Props) => {
    const { src } = props
    if (typeof src === 'string') {
      Image.getSize(props.src, (width, height) => {
        this.setState({ ratio: height / width })
      })
    } else {
      const source = Image.resolveAssetSource(props.src)
      this.setState({
        ratio: source ? (source.height / source.width) : 0
      })
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    this.loadImg(nextProps)
  }

  componentDidMount () {
    this.loadImg(this.props)
  }

  render () {
    let {
      style,
      src,
      mode,
    } = this.props

    const flattenStyle = StyleSheet.flatten(style)

    // The parameter passed to require must be a string literal
    // src = typeof src === 'string' && /^(https?:)?\/\//.test(src) ? { uri: src } : src
    src = typeof src === 'string' ? { uri: src } : src

    const isWidthFix = mode === 'widthFix'

    mode = resizeModeMap[mode] || (isWidthFix ? undefined : 'stretch')

    const imageHeight = (() => {
      if (isWidthFix) {
        let width = flattenStyle && flattenStyle.width
        typeof width === 'string' && (width = this.state.layoutWidth)
        return (width || 300) * this.state.ratio
      } else {
        return (flattenStyle && flattenStyle.height) || 225
      }
    })()

    return (
      <Image
        source={src}
        resizeMode={mode}
        onError={this.onError}
        onLoad={this.onLoad}
        onLayout={this.onLayout}
        style={[
          {
            width: 300
          },
          style,
          {
            height: imageHeight || this.state.imageHeight
          }
        ]}
      />
    )
  }
}

export { _Image }
export default Clickable(_Image)
