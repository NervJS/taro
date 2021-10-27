import {
  connectSocket,
  close,
  send,
  onOpen,
  onMessage,
  onError,
  onClose
} from './webSocket'

import {
  request,
  destroy,
  onHeadersReceived,
  offHeadersReceived
} from './request'

export {
  connectSocket,
  close,
  send,
  onOpen,
  onMessage,
  onError,
  onClose,
  request,
  destroy,
  onHeadersReceived,
  offHeadersReceived
}
