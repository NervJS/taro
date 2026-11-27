import Taro from '@tarojs/api'

let activeWorker: Worker | undefined

export const createWorker: typeof Taro.createWorker = scriptPath => {
  if (typeof Worker !== 'function') throw new Error('createWorker: Web Worker is unavailable')
  if (typeof scriptPath !== 'string' || !scriptPath.trim()) {
    throw new TypeError('createWorker: scriptPath must be a non-empty string')
  }
  if (activeWorker) throw new Error('createWorker: terminate the active worker before creating another')

  const worker = new Worker(scriptPath)
  activeWorker = worker
  return {
    onMessage (callback) {
      worker.addEventListener('message', event => callback({ message: event.data }))
    },
    onProcessKilled () {
      // Browsers do not expose system reclamation events for dedicated workers.
    },
    postMessage (message) {
      worker.postMessage(message)
    },
    terminate () {
      worker.terminate()
      if (activeWorker === worker) activeWorker = undefined
    },
  }
}
