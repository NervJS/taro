import { Server } from 'mock-socket'

import { connectSocket } from '../../src/api/network/websocket'

import type { SocketTask } from '../../src/api/network/websocket/socketTask'

describe('websocket connection cleanup', () => {
  let server: Server
  let tasks: SocketTask[]

  beforeEach(() => {
    tasks = []
    server = new Server('wss://localhost:8090')
  })

  afterEach(() => {
    tasks.forEach(task => task.close())
    server.stop()
  })

  const connect = async () => {
    const task = await connectSocket({ url: 'wss://localhost:8090' }) as SocketTask
    tasks.push(task)
    await new Promise(resolve => task.ws.addEventListener('open', resolve))
    return task
  }

  const closeFromServer = async (task: SocketTask) => {
    const closed = new Promise(resolve => task.ws.addEventListener('close', resolve))
    server.clients()[0].close()
    await closed
  }

  test('server closes release slots without a business onClose callback', async () => {
    for (let i = 0; i < 6; i++) {
      const task = await connect()
      await closeFromServer(task)
    }
    expect(tasks).toHaveLength(6)
  })

  test('registering an onClose callback preserves internal cleanup', async () => {
    const callback = jest.fn()
    for (let i = 0; i < 6; i++) {
      const task = await connect()
      task.onClose(callback)
      await closeFromServer(task)
    }
    expect(callback).toHaveBeenCalledTimes(6)
  })

  test('active connections still count towards the limit after a server close', async () => {
    for (let i = 0; i < 5; i++) await connect()
    await closeFromServer(tasks[0])
    await connect()
    await expect(connectSocket({ url: 'wss://localhost:8090' })).rejects.toMatchObject({
      errMsg: expect.stringContaining('5')
    })
  })
})
