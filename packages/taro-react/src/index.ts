/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from './render'
import { TaroReconciler } from './reconciler'

const unstable_batchedUpdates = TaroReconciler.batchedUpdates

export {
  render,
  unstable_batchedUpdates
}

export default {
  render,
  unstable_batchedUpdates
}
