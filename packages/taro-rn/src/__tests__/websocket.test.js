import { WebSocket, Server } from 'mock-socket'
import * as connectSocket from '../lib/connectSocket'

const Taro = Object.assign({}, connectSocket)

describe('websocket', () => {
  beforeEach(() => {
    global.WebSocket = WebSocket
  })

  test('url should be string', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(6)

    return Taro.connectSocket({
      url: {},
      success,
      fail,
      complete
    }).catch(err => {
      const expectErrMsg = 'connectSocket:fail parameter error: parameter.url should be String'
      expect(success.mock.calls.length).toBe(0)
      expect(fail.mock.calls.length).toBe(1)
      expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      expect(err.errMsg).toMatch(expectErrMsg)
    })
  })

  test('should not keep more than 2 connection', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(8)

    const socketTaskOne = await Taro.connectSocket({ url: 'wss://localhost:8080', success })
    expect(success.mock.calls[0][0])
      .toEqual({ socketTaskId: 1, socketTask: socketTaskOne, errMsg: 'connectSocket:ok' })

    const socketTaskTwo = await Taro.connectSocket({ url: 'wss://localhost:8090', success })
    expect(success.mock.calls[1][0])
      .toEqual({ socketTaskId: 2, socketTask: socketTaskTwo, errMsg: 'connectSocket:ok' })

    await Taro.connectSocket({
      url: 'wss://localhost:9080',
      success,
      complete,
      fail
    }).catch(err => {
      const expectErrMsg = '同时最多发起 2 个 socket 请求，更多请参考文档。'
      expect(success.mock.calls.length).toBe(2)
      expect(fail.mock.calls.length).toBe(1)
      expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      expect(err.errMsg).toMatch(expectErrMsg)
    })

    socketTaskOne.close()
    socketTaskTwo.close()
  })

  test('connection关闭的时候会重置总的socketTask数量', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(7)

    const socketTaskOne = await Taro.connectSocket({ url: 'wss://localhost:8080', success })
    expect(success.mock.calls.length).toBe(1)
    socketTaskOne.close()

    const socketTaskTwo = await Taro.connectSocket({ url: 'wss://localhost:8090', success })
    expect(success.mock.calls.length).toBe(2)

    const socketTaskThree = await Taro.connectSocket({
      url: 'wss://localhost:9080',
      success,
      complete,
      fail
    })
    expect(success.mock.calls.length).toBe(3)
    expect(fail.mock.calls.length).toBe(0)
    expect(complete.mock.calls.length).toBe(1)
    expect(success.mock.calls[2][0])
      .toEqual(expect.objectContaining({
        socketTask: socketTaskThree,
        errMsg: 'connectSocket:ok'
      }))
    expect(complete.mock.calls[0][0])
      .toEqual(expect.objectContaining({
        socketTask: socketTaskThree,
        errMsg: 'connectSocket:ok'
      }))

    socketTaskTwo.close()
    socketTaskThree.close()
  })
  // eslint-disable-next-line
  test('should work basically', async (done) => {
    const fakeURL = 'wss://localhost:8080'
    const mockServer = new Server(fakeURL)
    const connected = jest.fn()
    const success = jest.fn()
    const complete = jest.fn()
    const msg = 'hey gay!'
    const msg2 = 'hey gay!gay!'

    expect.assertions(11)

    mockServer.on('connection', connected)

    mockServer.on('message', message => {
      expect(message).toMatch(msg)
      mockServer.send(msg2)
    })

    const socketTask = await Taro.connectSocket({
      url: fakeURL,
      success,
      complete
    })

    const socketTaskSend = jest.spyOn(socketTask.ws, 'send')
    const socketTaskClose = jest.spyOn(socketTask.ws, 'close')
    const closeCode = 100
    const closeReason = 'hey'

    socketTask.onOpen(() => {
      socketTask.send({
        data: msg,
        success: (res) => {
          expect(socketTaskSend).toHaveBeenCalled()
          expect(res.errMsg).toMatch('sendSocketMessage:ok')
        },
      })
    })

    socketTask.onMessage(res => {
      expect(res.data).toMatch(msg2)
      socketTask.close({
        code: closeCode,
        reason: closeReason,
        success: (res) => {
          expect(socketTaskClose).toHaveBeenCalled()
          expect(res.errMsg).toMatch('sendSocketMessage:ok')
        },
      })
    })

    socketTask.onClose(({ code, reason }) => {
      const expectMsg = 'connectSocket:ok'
      expect(connected.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0].errMsg).toMatch(expectMsg)
      expect(complete.mock.calls[0][0].errMsg).toMatch(expectMsg)
      expect(code).toBe(closeCode)
      expect(reason).toBe(closeReason)
      done()
    })
  })
})
