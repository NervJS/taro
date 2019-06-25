import { getStore, setStore } from './utils/store'
import connect from './connect/connect'
import Provider from './connect/Provider'
import { useDispatch } from './hooks/use-dispatch'
import { useSelector } from './hooks/use-selector'
import { useStore } from './hooks/use-store'
import { ReduxContext } from './hooks/context'

export default {
  connect,
  Provider,
  getStore,
  setStore,
  useDispatch,
  useSelector,
  useStore,
  ReduxContext
}

export {
  connect,
  Provider,
  getStore,
  setStore,
  useDispatch,
  useSelector,
  useStore,
  ReduxContext
}
