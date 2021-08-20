/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import 'weui'
import React from 'react'
import classNames from 'classnames'
import './style/index.css'

require('intersection-observer')

interface IProps{
  className?: string,
  src: string,
  style?: Record<string, string>,
  mode: string,
  onError: () => void,
  onLoad: (e) => void,
  lazyLoad?: boolean,
  imgProps?: Record<string, any>,
}

class Image extends React.Component<IProps> {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false
    }
    this.imageOnLoad = this.imageOnLoad.bind(this)
    // this.observer = {}
  }

  observer: any = {}
  imgRef: any = null

  componentDidMount () {
    if (this.props.lazyLoad) {
      this.observer = new IntersectionObserver((entries) => {
        // 异步 api 关系
        if (entries[entries.length - 1].isIntersecting) {
          this.setState({ isLoaded: true }, () => {
            // findDOMNode(this).children[0].src = this.props.src
            this.imgRef.src = this.props.src
          })
        }
      }, {
        rootMargin: '300px 0px'
      })
      this.observer.observe(this.imgRef)
    }
  }

  componentWillUnmount () {
    this.observer.disconnect && this.observer.disconnect()
  }

  imageOnLoad (e) {
    const { onLoad } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      writable: true,
      value: {
        width: e.target.width,
        height: e.target.height
      }
    })

    onLoad && onLoad(e)
  }

  render () {
    const {
      className,
      src,
      style = {},
      mode,
      onError,
      lazyLoad,
      imgProps,
      ...reset
    } = this.props
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

    return (
      <div className={cls} style={style} {...reset}>
        {lazyLoad ? (
          <img
            ref={img => (this.imgRef = img)}
            className={imgCls}
            data-src={src}
            onLoad={this.imageOnLoad}
            onError={onError}
            {...imgProps}
          />
        ) : (
          <img
            ref={img => (this.imgRef = img)}
            className={imgCls}
            src={src}
            onLoad={this.imageOnLoad}
            onError={onError}
            {...imgProps}
          />
        )}
      </div>
    )
  }
}

export default Image
