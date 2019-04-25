import { errorsReporter } from './reporter'

export const onError = fn => errorsReporter.on(fn)

export * from './inject'
export { observer } from './observer'
export { getStore, setStore } from './store'