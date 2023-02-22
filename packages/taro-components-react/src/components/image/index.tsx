/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import 'weui'
import './style/index.css'

import classNames from 'classnames'
import React from 'react'

require('intersection-observer')

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  mode: string
  onError: () => void
  onLoad: (e) => void
  lazyLoad?: boolean
  imgProps?: Record<string, any>
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
      this.observer = new IntersectionObserver(
        entries => {
          // 异步 api 关系
          if (entries[entries.length - 1].isIntersecting) {
            this.setState({ isLoaded: true }, () => {
              // findDOMNode(this).children[0].src = this.props.src
              this.imgRef.src = this.props.src
            })
          }
        },
        {
          rootMargin: '300px 0px'
        }
      )
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
      style = {},
      src,
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
