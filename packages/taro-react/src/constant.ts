export const supportedInputTypes: { [key: string]: boolean } = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true,
}


const randomKey = Math.random()
  .toString(36)
  .slice(2)

export const internalPropsKey = '__reactProps$' + randomKey
export const internalInstanceKey = '__reactFiber$' + randomKey
export const internalContainerInstanceKey = '__reactContainer$' + randomKey
// const internalEventHandlersKey = '__reactEvents$' + randomKey
// const internalEventHandlerListenersKey = '__reactListeners$' + randomKey
// const internalEventHandlesSetKey = '__reactHandles$' + randomKey