import React from 'react'

/**
 * @description 组件的基类，注入 $router 等
 */
class Component extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (props.navigation) {
      this.$router = {params: props.navigation.state.params || {}, path: props.navigation.state.routeName ? ('/' + props.navigation.state.routeName) : null}
    }
  }

  get $app () {
    if (!this._reactInternalFiber) return {}
    return Taro._$app // eslint-disable-line
  }

  set $app (app) {
    console.warn('Please try not to set $app.')
  }
}

class PureComponent extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    if (props.navigation) {
      this.$router = {params: props.navigation.state.params || {}, path: props.navigation.state.routeName ? ('/' + props.navigation.state.routeName) : null}
    }
  }

  get $app () {
    if (!this._reactInternalFiber) return {}
    return Taro._$app // eslint-disable-line
  }

  set $app (app) {
    console.warn('Please try not to set $app.')
  }
}

export { Component, PureComponent }
