export const nervJsImportDefaultName = 'Nerv'
export const tabBarComponentName = 'Tabbar'
export const tabBarContainerComponentName = 'TabbarContainer'
export const tabBarPanelComponentName = 'TabbarPanel'
export const providerComponentName = 'Provider'
export const setStoreFuncName = 'setStore'
export const tabBarConfigName = '__tabs'
export const deviceRatioConfigName = 'deviceRatio'

export const MAP_FROM_COMPONENTNAME_TO_ID = new Map([
  ['Video', 'id'],
  ['Canvas', 'canvasId']
])
export const APIS_NEED_TO_APPEND_THIS = new Map([
  ['createVideoContext', 1],
  ['createCanvasContext', 1],
  ['canvasGetImageData', 1],
  ['canvasPutImageData', 1],
  ['canvasToTempFilePath', 1]
])
export const FILE_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}
