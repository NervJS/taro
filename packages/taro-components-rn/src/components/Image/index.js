/**
 * ✔ src
 * ✔ mode: Partial support
 * ✘ lazy-load
 * ✔ binderror
 * ✔ bindload
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  Image,
} from 'react-native'
import { omit } from '../../utils'

const resizeModeMap: Object = {
  scaleToFill: 'stretch',
  aspectFit: 'contain',
  aspectFill: 'cover',
  // Not supported value...
}

type Props = {
  src?: string,
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right',
  binderror?: Function,
  bindload?: Function,
}

class _Image extends Component<Props> {
  static defaultProps = {
    mode: 'scaleToFill',
  }

  onError = (event: Object) => {
    const { binderror } = this.props
    binderror && binderror({
      detail: { errMsg: 'something wrong' }
    })
  }

  onLoad = (event: Object) => {
    const { src, bindload } = this.props
    // @todo To be confirmed
    const { width, height } = Image.resolveAssetSource(src)
    bindload && bindload({
      detail: { width, height }
    })
  }

  render () {
    let {
      src,
      mode,
    } = this.props

    if (typeof src === 'string') {
      // $FlowFixMe: The parameter passed to require must be a string literal
      src = /^(https?:)?\/\//.test(src) ? { uri: src } : require(src)
    }

    mode = resizeModeMap[mode] || 'stretch'

    // @todo Add default size 300x225

    return (
      <Image
        {...omit(this.props, [
          'src',
          'mode',
          'binderror',
          'bindload',
        ])}
        source={src}
        resizeMode={mode}
        onError={this.onError}
        onLoad={this.onLoad}
      />
    )
  }
}

export default _Image
