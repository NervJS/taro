import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { errorHandler, shouleBeObject, successHandler } from './utils'

class RefreshProvider extends React.Component {
  constructor (props) {
    super(props)
    this._scrollView = React.createRef()
    this.state = {
      refreshing: false
    }
  }

  render () {
    const {enablePullDownRefresh, disableScroll} = this.props
    if (disableScroll) {
      return this.props.children
    } else {
      return (
        <ScrollView
          style={{flex: 1}}
          ref={this._scrollView}
          contentContainerStyle={{minHeight: '100%'}}
          scrollEventThrottle={5}
          alwaysBounceVertical
          onScroll={this.onScroll}
          refreshControl={
            enablePullDownRefresh
              ? <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handlePullDownRefresh}
              />
              : null
          }
        >
          {this.props.children && this.props.children}
        </ScrollView>
      )
    }
  }

  /**
   * duration 参数无效
   * @param options
   * @returns {*}
   */
  pageScrollTo = (options = {}) => {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = {errMsg: `pageScrollTo${isObject.msg}`}
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = {errMsg: 'navigateTo:ok'}
    let {scrollTop, success, fail, complete} = options

    if (typeof Number(scrollTop) !== 'number') {
      const res = {errMsg: 'pageScrollTo params scrollTop is not number'}
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    try {
      console.log(this._scrollView)
      this._scrollView.current.scrollTo({x: 0, y: Number(scrollTop), animated: true})
    } catch (e) {
      return errorHandler(fail, complete)({errMsg: e})
    }
    return successHandler(success, complete)(res)
  }

  onScroll = (e) => {
    this.props.onScroll && this.props.onScroll(e.nativeEvent.contentOffset.y)
  }

  // TODO 滚动到底部事件
  handleReachBottom = () => {
    this.props.onReachBottom && this.props.onReachBottom()
  }

  handlePullDownRefresh = (callback) => {
    this.setState({refreshing: true}, callback)
    try {
      // TODO 处理异步的情况
      this.props.onPullDownRefresh && this.props.onPullDownRefresh()
    } catch (e) {
      throw new Error(e)
    } finally {
      this.setState({refreshing: false})
    }
  }

  stopPullDownRefresh = (callback) => {
    this.setState({refreshing: false}, callback)
  }
}

export default RefreshProvider
