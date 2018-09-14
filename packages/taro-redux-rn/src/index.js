import { Provider, connect as originConnect, connectAdvanced } from 'react-redux'
import React from 'react'

function connect (mapStateToProps = null, mapDispatchToProps = null, mergeProps = null, options = {}) {

  options.withRef = true
  let connectAdvanced = originConnect(mapStateToProps, mapDispatchToProps, mergeProps, options)

  return (WrappedComponent) => {
    let Connect = connectAdvanced(WrappedComponent)

    class WrappedConnect extends React.Component {
      constructor (props, context) {
        super(props, context)
        this.connectRef = React.createRef()
      }

      static navigationOptions = WrappedComponent.navigationOptions || {}

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
