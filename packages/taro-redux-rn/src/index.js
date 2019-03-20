import { Provider, connect as originConnect, connectAdvanced } from 'react-redux'
import React from 'react'

function connect (mapStateToProps = null, mapDispatchToProps = null, mergeProps = null, options = {}) {

  options.withRef = true
  let connectAdvanced = originConnect(mapStateToProps, mapDispatchToProps, mergeProps, options)

  return (WrappedComponent) => {
    let Connect = connectAdvanced(WrappedComponent)

    /**
     * @description 必须暴露出 config 配置和 getWrappedInstance 方法，
     * 不然会影响相关生命周期调用及 Taro API 调用
     */
    class WrappedConnect extends React.Component {
      constructor (props, context) {
        super(props, context)
        this.connectRef = React.createRef()
      }

      // 必须将 config 暴露出去
      static config = WrappedComponent.config || {}

      /**
       * @description 获取 被包裹组件的实例
       * @returns {*}
       */
      getWrappedInstance () {
        return this.connectRef.current && this.connectRef.current.getWrappedInstance()
      }

      render () {
        return (
          <Connect ref={this.connectRef} {...this.props}/>
        )
      }
    }

    return WrappedConnect
  }
}

export { Provider, connect, connectAdvanced }
export default {Provider, connect, connectAdvanced}
