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
  // Not supported value...
}

type Props = {
  style?: StyleSheet.Styles,
  src?: string,
  mode: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right',
  onError?: Function,
  onLoad?: Function,
}

class _Image extends React.Component<Props> {
  props: Props

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
    const { width, height } = Image.resolveAssetSource(typeof src === 'string' && /^(https?:)?\/\//.test(src) ? { uri: src } : src)
    onLoad && onLoad({
      detail: { width, height }
    })
  }

  render () {
    let {
      style,
      src,
      mode,
    } = this.props

    // The parameter passed to require must be a string literal
    src = typeof src === 'string' && /^(https?:)?\/\//.test(src) ? { uri: src } : src

    mode = resizeModeMap[mode] || 'stretch'

    return (
      <Image
        source={src}
        resizeMode={mode}
        onError={this.onError}
        onLoad={this.onLoad}
        style={[{ width: 300, height: 225 }, style]}
      />
    )
  }
}

export { _Image }
export default Clickable(_Image)
