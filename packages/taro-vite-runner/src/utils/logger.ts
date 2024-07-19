import { createLogger } from 'vite'

const viteLogger = createLogger('info', {
  prefix: '[taro]',
  allowClearScreen: false
})

export const logger = {
  info (msg: string) {
    viteLogger.info(msg, {
      timestamp: true
    })
  },
  warn (msg: string) {
    viteLogger.warn(msg, {
      timestamp: true
    })
  },
  error (msg: string) {
    viteLogger.error(msg, {
      timestamp: true
    })
  }
}
