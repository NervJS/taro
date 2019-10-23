import { compile, pretty } from './compile'

describe('app loader', () => {
  describe('react', () => {
    test('自动插入 react 依赖', async () => {
      const result = await compile('react_1.txt', { type: 'app', framework: 'react' })

      expect(result).toBe(pretty(`
        import ReactDOM from "react-dom";
        import { createReactApp } from "@tarojs/runtime";
        import { app } from "./app";
        App(createReactApp(React, app, ReactDOM.render));
      `))
    })
  })
})
