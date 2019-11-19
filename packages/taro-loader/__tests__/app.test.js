import { compile, pretty } from './compile'

describe('app loader', () => {
  describe('react', () => {
    test('自动插入 react 依赖', async () => {
      const result = await compile('basic_1.txt', { type: 'app', framework: 'react' })
      // expect(true).toBe(false)
      expect(result).toBe(pretty(`
        import ReactDOM from "react-dom";
        import React from "react";
        import { createReactApp } from "@tarojs/runtime";
        import { app } from "./app";
        App(createReactApp(React, app, ReactDOM.render));
      `))
    })

    test('没有 export default 应该报错', async () => {
      const result = await compile('basic_1.txt', { type: 'app', framework: 'react' })
      // expect(true).toBe(false)
      expect(result).toBe(pretty(`
        import ReactDOM from "react-dom";
        import React from "react";
        import { createReactApp } from "@tarojs/runtime";
        import { app } from "./app";
        App(createReactApp(React, app, ReactDOM.render));
      `))
    })

    test('不重复添加依赖', async () => {
      const result = await compile('react-imported.txt', { type: 'app', framework: 'react' })
      expect(result).toBe(pretty(`
          import ReactDOM from "react-dom";
          import { createReactApp } from "@tarojs/runtime";
          import React from "react";
          import { app } from "./app";
          App(createReactApp(React, app, ReactDOM.render));
      `))
    })

    test('rename App', async () => {
      const result = await compile('rename-app.txt', { type: 'app', framework: 'react' })
      expect(result).toBe(pretty(`
      import ReactDOM from "react-dom";
      import React from "react";
      import { createReactApp } from "@tarojs/runtime";

      class __App extends Component {
        render() {
          return null;
        }
      }

      App(createReactApp(React, __App, ReactDOM.render))
      `))
    })
  })

  describe('vue', () => {
    test('自动插入 vue 依赖', async () => {
      const result = await compile('basic_1.txt', { type: 'app', framework: 'vue' })

      expect(result).toBe(pretty(`
        import Vue from "vue";
        import { createVueApp } from "@tarojs/runtime";
        import { app } from "./app";
        App(createVueApp(Vue, app));
      `))
    })

    test('不重复添加依赖', async () => {
      const result = await compile('vue-imported.txt', { type: 'app', framework: 'vue' })
      expect(result).toBe(pretty(`
        import { createVueApp } from "@tarojs/runtime";
        import Vue from "vue";
        import { app } from "./app";
        App(createVueApp(Vue, app));
      `))
    })
  })
})
