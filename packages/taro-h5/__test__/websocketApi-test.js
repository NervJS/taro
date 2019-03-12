/* eslint-disable */
import { Websocket, Server } from 'mock-socket'
import mockConsole from 'jest-mock-console'
import * as Taro from '../src/api'

describe('websocket', () => {
  test('options should be object', () => {
    mockConsole()

    expect.assertions(2)
    return Taro.connectSocket()
      .catch(err => {
        const expectErrMsg = 'connectSocket:fail parameter error: parameter should be Object instead of Undefined'
        expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
      })
  })

  test('options.url should be string', () => {
    mockConsole()
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(7)
    return Taro.connectSocket({
      url: 1,
      success,
      fail,
      complete
    })
      .catch(err => {
        const expectErrMsg = 'connectSocket:fail parameter error: parameter.url should be String instead of Number'
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
      })
  })

  test('options.url should be starts with ws:// or wss://', () => {
    mockConsole()
    const url = 'http://localhost:8080'
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(7)
    return Taro.connectSocket({
      url,
      success,
      fail,
      complete
    })
      .catch(err => {
        const expectErrMsg = `request:fail invalid url "${url}"`
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
      })
  })

  test('should not keep more than 2 connection', () => {
    mockConsole()
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(9)
    return Promise.all([
      Taro.connectSocket({ url: 'wss://localhost:8080', success })
        .then(task => {
          expect(success.mock.calls[0][0]).toEqual({ socketTaskId: 1, errMsg: 'connectSocket:ok'})
          task.close()
        }),
      Taro.connectSocket({ url: 'wss://localhost:8090', success })
        .then(task => {
          task.close()
          expect(success.mock.calls[1][0]).toEqual({ socketTaskId: 2, errMsg: 'connectSocket:ok'})
        }),
      Taro.connectSocket({
        url: 'wss://localhost:9090',
        success,
        fail,
        complete
      })
        .catch(err => {
          const expectErrMsg = `同时最多发起 2 个 socket 请求，更多请参考文档。`
          expect(success.mock.calls.length).toBe(2)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          expect(err.errMsg).toMatch(expectErrMsg)
        })
    ])
  })

  test('should work basically', done => {
    const mockServer = new Server('wss://localhost:8080')
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
      .then(task => {
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
        .then(task => {
          expect(task.ws.protocol).toMatch('foo')
          task.close()
        }),
      Taro.connectSocket({ url: 'ws://not-real-too', protocols: 'bar' })
        .then(task => {
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
      .then(task => {
        task.onOpen(() => {})
        task.onMessage(res => {})
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
    mockConsole()
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    return Taro.connectSocket({
      url: 'wss://localhost:8080'
    })
      .then(task => {
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
