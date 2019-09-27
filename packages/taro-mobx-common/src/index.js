import { errorsReporter } from './reporter'

export const onError = fn => errorsReporter.on(fn)

export { PropTypes } from "./propTypes"

export { useLocalStore } from './useLocalStore'
export { useAsObservableSource } from './useAsObservableSource'
export { isUsingStaticRendering, useStaticRendering } from './staticRendering'

export { getStore, setStore } from './store'
export { errorsReporter } from './reporter'
export { inject, getInjectName, mapStoreToProps } from './inject'
