import { History } from '../../utils/types';

const initLocation = {
  hash: "",
  params: {},
  pathname: "/",
  search: "",
  state: {key: "0"}
}

const noop = () => {}
const listeners: History.LocationListener[] = []

const listen = (listener: History.LocationListener) => {
  if (listeners.length) return noop

  listeners.push(listener)
  return () => {
    listeners.length = 0
  }
}

const notify = (opts) => {
  listeners.forEach(v => {
    v(opts)
  })
}


const history = {
  listen,
  location: initLocation,
  notify
}

export default () => history
