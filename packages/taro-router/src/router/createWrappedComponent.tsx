import { PropTypes } from 'nervjs';

import { tryToCall } from '../utils';
import * as Types from '../utils/types';


const createWrappedComponent = (component: Types.PageComponent) => {
  class WrappedComponent extends component {
    $router: Types.Location

    static contextTypes = {
      router: PropTypes.object,
      store: PropTypes.object
    }

    constructor(props, context) {
      super(props, context)
      this.$router = props.router.location
    }

    componentDidMount () {
      const componentDidShow = super.componentDidShow
      const componentDidMount = super.componentDidMount

      tryToCall(componentDidMount, this)
      tryToCall(componentDidShow, this)
    }

    componentWillReceiveProps (nProps, nContext) {
      const componentWillReceiveProps = super.componentWillReceiveProps
      const componentDidShow = super.componentDidShow
      const componentDidHide = super.componentDidHide
      const nextMatched = nProps.router.matched
      const lastMatched = this.props.router.matched

      this.$router = this.props.router.location

      if (nextMatched || lastMatched) {
        tryToCall(componentWillReceiveProps, this, nProps, nContext)
      }

      if (nextMatched === lastMatched) return

      if (nextMatched === true) {
        tryToCall(componentDidShow, this)
      } else {
        tryToCall(componentDidHide, this)
      }
    }

    // TODO 支持页面title

    componentWillUnmount() {
      const componentDidHide = super.componentDidHide
      const componentWillUnmount = super.componentWillUnmount
      tryToCall(componentDidHide, this)
      tryToCall(componentWillUnmount, this)
    }

    render() {
      const { router } = this.props
      if (router.matched) {
        return super.render()
      } else {
        return null
      }
    }
  }
  return WrappedComponent;
}

export default createWrappedComponent
