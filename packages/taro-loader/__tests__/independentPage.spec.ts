import * as vm from 'node:vm'

import independentPage from '../src/independentPage'

describe('independent page loader', () => {
  test('initializes a shared app once as pages are loaded lazily', () => {
    const current: { app?: object } = {}
    const createReactApp = jest.fn(() => { current.app = {} })
    const Page = jest.fn(config => config)

    for (const name of ['packageA/first', 'packageA/second']) {
      const loaderContext = {
        context: '/project/src',
        resourcePath: `/project/src/${name}.tsx`,
        utils: { contextify: (_context: string, request: string) => request },
        getOptions: () => ({
          name,
          config: {},
          appConfig: {},
          runtimePath: [],
          behaviorsName: 'behaviors',
          loaderMeta: {
            isNeedRawLoader: false,
            importFrameworkStatement: '',
            mockAppStatement: 'class App {}',
            frameworkArgs: 'React, ReactDOM, config',
            creator: 'createReactApp',
            creatorLocation: 'framework-runtime'
          }
        })
      }
      const source = independentPage.call(loaderContext as any, '')
        .replace(/^import .*$/gm, '')
        .replace(/^export default component$/gm, '')

      vm.runInNewContext(source, {
        App: undefined,
        Current: current,
        Page,
        React: {},
        ReactDOM: {},
        createPageConfig: (_component, pageName) => ({ pageName }),
        createReactApp,
        require: () => ({ default: {} }),
        window: {}
      })
    }

    expect(createReactApp).toHaveBeenCalledTimes(1)
    expect(Page).toHaveBeenCalledTimes(2)
    expect(Page.mock.calls.map(([config]) => config.pageName)).toEqual(['packageA/first', 'packageA/second'])
  })
})
