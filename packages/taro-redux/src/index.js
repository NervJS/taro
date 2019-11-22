import { getStore, setStore } from './utils/store'
import connect from './connect/connect'
import Provider from './connect/Provider'
import { useDispatch } from './hooks/use-dispatch'
import { useSelector } from './hooks/use-selector'
import { useStore } from './hooks/use-store'
import { ReduxContext } from './hooks/context'
import shallowEqual from './utils/shallowEqual'

export default {
  connect,
  Provider,
  getStore,
  setStore,
  useDispatch,
  useSelector,
  useStore,
  ReduxContext,
  shallowEqual
}

export {
  connect,
  Provider,
  getStore,
  setStore,
  useDispatch,
  useSelector,
  useStore,
  ReduxContext,
  shallowEqual
}
