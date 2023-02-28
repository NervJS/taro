import { initNativeApi } from './apis'

export { initNativeApi }
export * from './apis-list'
export * from './components'
export const hostConfig = {
  initNativeApi,
  modifyMpEventImpl: (event) => {
    if (event.type === 'regionchange') {
      event.type = event.detail.type
    }
  }
}
