import React from 'react'

/**
 * @description 组件的基类，注入 $router 等
 */
class Component extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (props.navigation) {
      this.$router = props.navigation.state.params || {}
    }
  }
}

export default Component
