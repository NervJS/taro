import { Component } from '@tarojs/taro-h5'
import Nerv, { PropTypes } from 'nervjs'

import { tryToCall } from '../utils/index'
import * as Types from '../utils/types'

const createWrappedComponent = (component: Types.PageComponent) => {
  class WrappedComponent extends component {
    static contextTypes = {
      router: PropTypes.object,
      store: PropTypes.object
    }

    wrappedInstance: Component<{ __router: {
      matched: boolean
    } }>

    componentDidMount () {
      const ctx = this.wrappedInstance || this
      const componentDidShow = ctx.componentDidShow
      const superComponentDidMount = super.componentDidMount
      let {
        navigationBarTitleText = ''
      } = ctx['config'] || {}
      ctx.componentDidShow = () => {
        tryToCall(componentDidShow, ctx)
        if (navigationBarTitleText) {
          document.title = navigationBarTitleText
        }
      }
      tryToCall(superComponentDidMount, this)
      if (this.wrappedInstance) {
        const componentDidMount = ctx.componentDidMount        
        if (!this.wrappedInstance['__cdm_modified']) {
          this.wrappedInstance['__cdm_modified'] = true
          this.wrappedInstance.componentDidMount = () => {
            tryToCall(componentDidMount, ctx)
            tryToCall(componentDidShow, ctx)
          }
        }
        tryToCall(superComponentDidMount, this)
      } else {
        tryToCall(componentDidShow, ctx)
      }
    }

    componentWillReceiveProps (nProps, nContext) {
      const superComponentWillReceiveProps = super.componentWillReceiveProps
      const nextMatched = nProps.__router.matched
      const lastMatched = this.props.__router.matched
      const ctx = this.wrappedInstance || this
      const componentDidShow = ctx.componentDidShow
      const componentDidHide = ctx.componentDidHide

      if (nextMatched || lastMatched) {
        tryToCall(superComponentWillReceiveProps, this, nProps, nContext)
      }
      if (nextMatched === lastMatched) return

      if (this.wrappedInstance) {
        const componentWillReceiveProps = this.wrappedInstance.componentWillReceiveProps
        if (!this.wrappedInstance['__cwrp_modified']) {
          this.wrappedInstance['__cwrp_modified'] = true
          this.wrappedInstance.componentWillReceiveProps = (nextProps, nextContext) => {
            tryToCall(componentWillReceiveProps, ctx, nextProps, nextContext)
            if (nextProps.__router.matched) {
              tryToCall(componentDidShow, ctx)
            } else {
              tryToCall(componentDidHide, ctx)
            }
          }
        }
      } else {
        if (nextMatched === true) {
          tryToCall(componentDidShow, ctx)
        } else {
          tryToCall(componentDidHide, ctx)
        }
      }
    }

    componentWillUnmount () {
      let ctx = this.wrappedInstance || this
      let componentDidHide = ctx.componentDidHide
      let superComponentWillUnmount = super.componentWillUnmount

      tryToCall(superComponentWillUnmount, this)

      if (this.wrappedInstance) {
        /* for redux */
        const componentWillUnmount = ctx.componentWillUnmount
        if (!this.wrappedInstance['__cwun_modified']) {
          this.wrappedInstance['__cwun_modified'] = true
          this.wrappedInstance.componentWillUnmount = () => {
            tryToCall(componentWillUnmount, ctx)
            tryToCall(componentDidHide, ctx)
          }
        }
      } else {
        tryToCall(componentDidHide, ctx)
      }
    }

    render () {
      const { router } = this.context
      return (
        <div
          className='taro_page'
          style={{
            display: router.matched ? 'block' : 'none'
          }}>
          {super.render()}
        </div>
      )
    }
  }
  return WrappedComponent
}

export default createWrappedComponent
