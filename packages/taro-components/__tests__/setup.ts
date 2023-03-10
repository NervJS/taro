/* eslint-disable no-useless-constructor, @typescript-eslint/no-unused-vars */

// @ts-ignore
globalThis.MutationObserver = class {
  constructor (_callback) {}
  disconnect () {}
  observe (_element, _initObject) {}
}
