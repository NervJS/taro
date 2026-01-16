import { Component } from 'react'

export class TaroComponent extends Component {
  $router = {
    params: {
      a: 1
    }
  }

  $scope = {}
}

export const delay = (fn, timeout = 0) => {
  setTimeout(() => {
    fn()
  }, timeout)
}

// 检查 fn1 的第一次调用发生在 fn2 的第一次调用之前
export function wasCalledBefore(fn1, fn2) {
  expect(fn1.mock.invocationCallOrder[0]).toBeLessThan(fn2.mock.invocationCallOrder[0])
}
