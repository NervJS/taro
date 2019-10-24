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
  })
})
