import { window } from '@tarojs/runtime'
import { request, RequestTask } from '@tarojs/taro'

import { XMLHttpRequest, XMLHttpRequestEvent } from '../../dist/runtime'

jest.mock('@tarojs/taro', () => {
  return {
    request: jest.fn(),
  }
})

const requestMock = jest.mocked(request)

describe('XMLHttpRequest', () => {
  it('大写header key', async () => {
    const data = 'success'
    // 模拟实现 request 函数
    requestMock.mockImplementation((opt) => {
      if (opt.success) {
        const header = { 'Content-Length': data.length.toString() }
        opt.success({ data: data as any, header, statusCode: 200, errMsg: '' })
      }
      if (opt.complete) {
        opt.complete({ errMsg: '' })
      }
      return {} as RequestTask<any>
    })
    // 发起请求
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'localhost')
    const req = new Promise<XMLHttpRequestEvent>((resolve, reject) => {
      xhr.addEventListener('load', resolve)
      xhr.addEventListener('error', reject)
    })
    xhr.send('')
    await req
    // 检查是否能正常读取大写的header
    expect(xhr.status).toBe(200)
    expect(data.length).toBeGreaterThan(0)
    expect(xhr.getResponseHeader('Content-length')).toBe(data.length.toString())
    expect(xhr.getResponseHeader('content-length')).toBe(data.length.toString())
    expect(xhr.getResponseHeader('Content-Length')).toBe(data.length.toString())
  })
  it('小写header key', async () => {
    const data = 'success'
    // 模拟实现 request 函数
    requestMock.mockImplementation((opt) => {
      if (opt.success) {
        const header = { 'content-length': data.length.toString() }
        opt.success({ data: data as any, header, statusCode: 200, errMsg: '' })
      }
      if (opt.complete) {
        opt.complete({ errMsg: '' })
      }
      return {} as RequestTask<any>
    })
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'localhost')
    const req = new Promise<XMLHttpRequestEvent>((resolve, reject) => {
      xhr.addEventListener('load', resolve)
      xhr.addEventListener('error', reject)
    })
    xhr.send('')
    await req
    // 检查是否能成功读取小写的header
    expect(xhr.status).toBe(200)
    expect(xhr.responseText).toBe(data)
    expect(xhr.getResponseHeader('Content-length')).toBe(data.length.toString())
    expect(xhr.getResponseHeader('content-length')).toBe(data.length.toString())
    expect(xhr.getResponseHeader('Content-Length')).toBe(data.length.toString())
  })

  it('set-cookie', async () => {
    const data = 'success'
    // 模拟实现 request 函数
    requestMock.mockImplementation((opt) => {
      if (opt.success) {
        const header = { 'set-cookie': 'aaa=bbb; domain=taro.com' }
        opt.success({ data: data as any, header, statusCode: 200, errMsg: '' })
      }
      if (opt.complete) {
        opt.complete({ errMsg: '' })
      }
      return {} as RequestTask<any>
    })
    // 发送一个请求
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'localhost')
    const req = new Promise<XMLHttpRequestEvent>((resolve, reject) => {
      xhr.addEventListener('load', resolve)
      xhr.addEventListener('error', reject)
    })
    // 在发送请求之前cookie为空
    expect(window.document.cookie.length).toBe(0)
    xhr.send('')
    // 等待请求加载完成
    await req
    // 检查是否能读取set-cookie
    expect(window.document.cookie.length).not.toBe(0)
  })
})
