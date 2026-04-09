/* eslint-disable no-undef */
// @ts-nocheck
const registerRecursiveComponent = globalThis.__taroRegisterRecursiveComponent

if (typeof registerRecursiveComponent !== 'function') {
  throw new Error('globalThis.__taroRegisterRecursiveComponent is not a function')
}
