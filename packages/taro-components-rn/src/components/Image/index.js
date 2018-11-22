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
  ratio: number,
  imageHeight: number
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
    const { width, height } = Image.resolveAssetSource(typeof src === 'string' ? { uri: src } : src)
    onLoad && onLoad({
      detail: { width, height }
    })
  }

  onLayout = (event: Object) => {
    const { mode, style } = this.props
    const { width: layoutWidth } = event.nativeEvent.layout
    const flattenStyle = StyleSheet.flatten(style) || {}
    if (mode === 'widthFix' && typeof flattenStyle.width === 'string') {
      if (this._isMounted) return
      this.setState({
        layoutWidth
      })
    }
  }

  loadImg = (props: Props) => {
    const { mode, src } = props
    if (mode !== 'widthFix') return
    if (typeof src === 'string') {
      Image.getSize(props.src, (width, height) => {
        if (this._isMounted) return
        this.setState({
          ratio: height / width
        })
    })
    } else {
      const { width, height } = Image.resolveAssetSource(props.src) || {}
      if (this._isMounted) return
      this.setState({
        ratio: height / width
      })
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    this.loadImg(nextProps)
  }

  componentWillMount () {
    this._isMounted = true
  }

  componentDidMount () {
    this._isMounted = false
    this.loadImg(this.props)
  }

  render () {
    let {
      style,
      src,
      mode,
    } = this.props

    const flattenStyle = StyleSheet.flatten(style) || {}

    // The parameter passed to require must be a string literal
    src = typeof src === 'string' ? { uri: src } : src

    const isWidthFix = mode === 'widthFix'

    const rMode = resizeModeMap[mode] || (isWidthFix ? undefined : 'stretch')

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

    return (
      <Image
        source={src}
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
      />
    )
  }
}

export { _Image }
export default Clickable(_Image)
