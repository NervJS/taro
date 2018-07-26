import React from 'react'

class Component extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (props.navigation) {
      this.$router = props.navigation.state.params || {}
    }
  }
}

export default Component
