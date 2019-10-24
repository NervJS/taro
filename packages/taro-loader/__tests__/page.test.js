import { compile, pretty } from './compile'

describe('page loader', () => {
  describe('react', () => {
    test('basic', async () => {
      const result = await compile('basic_1.txt', { type: 'page', framework: 'react' })

      expect(result).toBe(pretty(`
        import { createPageConfig } from "@tarojs/runtime";
        import { app } from "./app";
        Page(createPageConfig(app));
      `))
    })

    test('react component', async () => {
      const result = await compile('react.txt', { type: 'page', framework: 'react' })

      expect(result).toBe(pretty(`
        import { createPageConfig } from "@tarojs/runtime";
        import React from "react";
    
        class A extends Component {
          render() {
            return React.createElement("div");
          }
        }
    
        Page(createPageConfig(connect({})(A)));
      `))
    })

    test('react component 2', async () => {
      const result = await compile('react2.txt', { type: 'page', framework: 'react' })

      expect(result).toBe(pretty(`
        import { createPageConfig } from "@tarojs/runtime";
        import React from "react";
    
        class A extends Component {
          render() {
            return React.createElement("div");
          }
        }
    
        Page(createPageConfig(connect({})(A)));
      `))
    })
  })

  describe('vue', () => {
    test('basic', async () => {
      const result = await compile('basic_1.txt', { type: 'page', framework: 'vue' })

      expect(result).toBe(pretty(`
        import { createPageConfig } from "@tarojs/runtime";
        import { app } from "./app";
        Page(createPageConfig(app));
      `))
    })
  })
})
