import { taroJsRedux, taroJsMobx, taroJsMobxCommon } from '@tarojs/helper'

export const QUICKAPP_SPECIAL_COMPONENTS = new Set<string>([
  'View',
  'Text',
  'Block'
])

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC',
  EXPORTS = 'EXPORTS'
}

export const excludeReplaceTaroFrameworkPkgs = new Set([taroJsRedux, taroJsMobx, taroJsMobxCommon])

export const GLOBAL_PROPS = '{Function: Function,Boolean: Boolean,Object: Object,Number: Number,Array: Array,Date: Date,String: String,Symbol: Symbol,Error: Error,TypeError: TypeError,Map: Map,Set: Set,WeakMap: WeakMap,WeakSet: WeakSet,ArrayBuffer: ArrayBuffer,Math: Math,Promise: Promise,RegExp: RegExp,DataView: DataView,isFinite: isFinite,parseInt: parseInt,parseFloat: parseFloat,Float32Array: Float32Array,Float64Array: Float64Array,Int8Array: Int8Array,Int16Array: Int16Array,Int32Array: Int32Array,Uint8Array: Uint8Array,Uint16Array: Uint16Array,Uint32Array: Uint32Array,Uint8ClampedArray: Uint8ClampedArray,setTimeout: setTimeout,clearTimeout: clearTimeout,setInterval: setInterval,clearInterval: clearInterval}'
