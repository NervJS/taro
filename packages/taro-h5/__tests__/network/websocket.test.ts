import * as Taro from '@tarojs/taro-h5'
import { Server } from 'mock-socket'

const mockConsole = require('jest-mock-console')

describe('websocket', () => {
  beforeEach(() => {
    mockConsole()
  })
  test('options should be object', () => {
    expect.assertions(2)
    return Taro.connectSocket()
      .catch(err => {
        const expectErrMsg = 'connectSocket:fail parameter error: parameter should be Object instead of Undefined'
        expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
      })
  })

  test('options.url should be string', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(5)
    return Taro.connectSocket({
      url: 1 as any,
      success,
      fail,
      complete
    })
      .then(() => {
        const expectErrMsg = 'connectSocket:fail parameter error: parameter.url should be String instead of Number'
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
      })
  })

  test('options.url should be starts with ws:// or wss://', () => {
    const url = 'http://localhost:8080'
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(5)
    return Taro.connectSocket({
      url,
      success,
      fail,
      complete
    })
      .then(() => {
        const expectErrMsg = `connectSocket:fail request:fail invalid url "${url}"`
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
      })
  })

  test('should not keep more than 2 connection', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(7)
    return Promise.all([
      Taro.connectSocket({ url: 'wss://localhost:8080', success })
        .then((task: any) => {
          expect(success.mock.calls[0][0]).toEqual({ socketTaskId: 1, errMsg: 'connectSocket:ok' })
          task.close()
        }),
      Taro.connectSocket({ url: 'wss://localhost:8090', success })
        .then((task: any) => {
          task.close()
          expect(success.mock.calls[1][0]).toEqual({ socketTaskId: 2, errMsg: 'connectSocket:ok' })
        }),
      Taro.connectSocket({
        url: 'wss://localhost:9090',
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'connectSocket:fail 同时最多发起 2 个 socket 请求，更多请参考文档。'
          expect(success.mock.calls.length).toBe(2)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        })
    ])
  })

  test('should work basically', done => {
    const mockServer: any = new Server('wss://localhost:8080')
    const connected = jest.fn()
    const success = jest.fn()
    const complete = jest.fn()
    const msg = 'hello'
    const msg2 = 'hello too'

    mockServer.on('connection', connected)
    mockServer.on('message', message => {
      expect(message).toMatch(msg)
      mockServer.send(msg2)
    })

    expect.assertions(11)
    Taro.connectSocket({
      url: 'wss://localhost:8080',
      success,
      complete
    })
      .then((task: any) => {
        const closeCode = 100
        const closeReason = 'yeah'
        jest.spyOn(task.ws, 'send')
        jest.spyOn(task.ws, 'close')

        task.onOpen(() => {
          task.send({ data: msg })
            .then(res => {
              expect(task.ws.send).toHaveBeenCalled()
              expect(res.errMsg).toMatch('sendSocketMessage:ok')
            })
        })
        task.onMessage(res => {
          expect(res.data).toMatch(msg2)
          task.close({
            code: closeCode,
            reason: closeReason
          })
            .then(res => {
              expect(task.ws.close).toHaveBeenCalled()
              expect(res.errMsg).toMatch('closeSocket:ok')
            })
        })
        task.onClose(({ code, reason }) => {
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

  test('that passing protocols into the constructor works', () => {
    expect.assertions(2)
    return Promise.all([
      Taro.connectSocket({ url: 'ws://not-real', protocols: ['foo'] })
        .then((task: any) => {
          expect(task.ws.protocol).toMatch('foo')
          task.close()
        }),
      Taro.connectSocket({ url: 'ws://not-real-too', protocols: 'bar' as any })
        .then((task: any) => {
          expect(task.ws.protocol).toMatch('')
          task.close()
        })
    ])
  })

  test('that on(open, message, error, and close) can be set', () => {
    expect.assertions(4)
    return Taro.connectSocket({
      url: 'wss://localhost:8080'
    })
      .then((task: any) => {
        task.onOpen(() => {})
        task.onMessage(() => {})
        task.onClose(() => {})
        task.onError(() => {})
        const { listeners } = task.ws
        expect(listeners.open.length).toBe(1)
        expect(listeners.message.length).toBe(1)
        expect(listeners.close.length).toBe(1)
        expect(listeners.error.length).toBe(1)
        task.close()
      })
  })

  test('that sending when the socket is closed throws an expection', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    return Taro.connectSocket({
      url: 'wss://localhost:8080'
    })
      .then((task: any) => {
        task.send({
          data: 'test',
          success,
          fail,
          complete
        })
          .catch(res => {
            expect(console.error).toHaveBeenLastCalledWith(res.errMsg)
            expect(success.mock.calls.length).toBe(0)
            expect(fail.mock.calls[0][0]).toEqual(res)
            expect(complete.mock.calls[0][0]).toEqual(res)
            task.close()
          })
      })
  })
})
