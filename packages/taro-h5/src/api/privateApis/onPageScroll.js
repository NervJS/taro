import { createCallbackManager, createScroller } from '../utils'

export const onPageScroll = (opt) => {
  const callbackManager = createCallbackManager()
  const scroller = createScroller(opt.ctx)
  const onScroll = () => {
    callbackManager.trigger({
      scrollTop: scroller.getPos()
    })
  }

  callbackManager.add(opt)
  scroller.listen(onScroll)

  return () => {
    callbackManager.remove(opt)
    if (callbackManager.count() === 0) {
      scroller.unlisten(onScroll)
    }
  }
}
