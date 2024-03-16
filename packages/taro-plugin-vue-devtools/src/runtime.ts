import createSocket from './socket-io'

const { connect } = require('./backend')

declare const __VUE_DEVTOOLS_HOSTNAME__: string
declare const __VUE_DEVTOOLS_PORT__: number

connect(__VUE_DEVTOOLS_HOSTNAME__, __VUE_DEVTOOLS_PORT__, {
  io: createSocket
})
