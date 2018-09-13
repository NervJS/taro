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

      componentDidMount () {
        let wrappedInstance = this.connectRef.current.getWrappedInstance()
        wrappedInstance.componentDidShow && wrappedInstance.componentDidShow()
      }

      componentWillUnmount () {
        let wrappedInstance = this.connectRef.current.getWrappedInstance()
        wrappedInstance.componentDidHide && wrappedInstance.componentDidHide()
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
