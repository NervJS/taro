const appGlobal = global || {}
const globalRef = Object.getPrototypeOf(appGlobal) || appGlobal

export default globalRef
