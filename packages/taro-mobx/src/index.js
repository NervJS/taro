import { spy, configure, getDebugName } from 'mobx'
import { Component, unstable_batchedUpdates as rdBatched } from 'nervjs'

import * as propTypes from './propTypes'

import {renderReporter, componentByNodeRegistry, trackComponents, errorsReporter} from './observer'

if (!Component) throw new Error('mobx-react requires React to be available')
if (!spy) throw new Error('mobx-react requires mobx to be available')

if (typeof rdBatched === 'function') {
  configure({
    reactionScheduler: rdBatched
  })
}

export {observer, Observer, renderReporter, componentByNodeRegistry as componentByNodeRegistery, componentByNodeRegistry, trackComponents, useStaticRendering} from './observer'

export { default as Provider } from './Provider'
export { default as inject } from './inject'
export { propTypes }
export { propTypes as PropTypes }
export const onError = fn => errorsReporter.on(fn)

if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
  const mobx = {
    spy,
    extras: {
      getDebugName
    }
  }
  const mobxReact = {
    renderReporter,
    componentByNodeRegistry,
    componentByNodeRegistery: componentByNodeRegistry,
    trackComponents
  }
  /* eslint-disable */
    __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobxReact(mobxReact, mobx);
}
