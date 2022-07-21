import WebSocket from './websocket'
const { connectToDevTools } = require('./backend')

declare const __REACT_DEVTOOLS_PORT__: number

const ws = new WebSocket(`ws://localhost:${__REACT_DEVTOOLS_PORT__}`)

connectToDevTools({
  // host: string (defaults to "localhost") - Websocket will connect to this host.
  port: __REACT_DEVTOOLS_PORT__, // number (defaults to 8097) - Websocket will connect to this port.
  // useHttps: boolean (defaults to false) - Websocket should use a secure protocol (wss).
  websocket: ws // Custom websocket to use. Overrides host and port settings if provided.
})
