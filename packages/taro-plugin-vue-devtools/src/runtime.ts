import createSocket from './socket-io'

const { connect } = require('./backend')

declare const __VUE_DEVTOOLS_PORT__: number

connect('localhost', __VUE_DEVTOOLS_PORT__, {
  io: createSocket
})
