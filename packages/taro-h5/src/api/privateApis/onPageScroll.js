import { createCallbackManager, createScroller } from '../utils'

export const onPageScroll = (opt) => {
  const callbackManager = createCallbackManager()
  const scroller = createScroller(opt.ctx)
  let lastPos = 0
  const onScroll = () => {
    const newPos = scroller.getPos()
    if (newPos === lastPos) return
    lastPos = newPos
    callbackManager.trigger({
      scrollTop: newPos
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
