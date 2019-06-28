import { errorsReporter } from './reporter'

export const onError = fn => errorsReporter.on(fn)

export { observer } from './observer'
export { useLocalStore } from './useLocalStore'
export { useAsObservableSource } from './useAsObservableSource'
export { isUsingStaticRendering, useStaticRendering } from './staticRendering'

export { getStore, setStore } from './store'
export { inject, getInjectName, mapStoreToProps } from './inject'