import { projAppJS, simpleAppJS, reduxAppJS } from './mocks/app'
import { simplePageJS, reduxPageJS } from './mocks/page'

const {transformJSCode} = require('../src/rn/transformJS')
const _ = require('lodash')

const filePath = '/Users/chengshuai/Taro/taro-quick-start/src/app.js'
const tsFilePath = '/Users/chengshuai/Taro/taro-quick-start/src/app.ts'
const projectConfig = require('./mocks/config')(_.merge)

describe('RN', function () {
  describe('transformJSCode', function () {
    describe('app.js', function () {
      it('should transform projAppJS conrrect', function () {
        const transformResult = transformJSCode(
          {
            code: projAppJS,
            filePath,
            isEntryFile: true,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })

      it('should transform simpleAppJS conrrect', function () {
        const transformResult = transformJSCode(
          {
            code: simpleAppJS,
            filePath,
            isEntryFile: true,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })

      it('should transform reduxAppJS conrrect', function () {
        const transformResult = transformJSCode(
          {
            code: reduxAppJS,
            filePath,
            isEntryFile: true,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })

      it('should transform appx.ts conrrect', function () {
        const transformResult = transformJSCode(
          {
            code: simpleAppJS,
            filePath: tsFilePath,
            isEntryFile: true,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })
    })
    describe('page.js', function () {
      it('should transform simplePageJS conrrect', function () {
        const transformResult = transformJSCode(
          {
            code: simplePageJS,
            filePath,
            isEntryFile: false,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })

      it('should transform reduxPageJS conrrect , with decorator', function () {
        const transformResult = transformJSCode(
          {
            code: reduxPageJS,
            filePath,
            isEntryFile: false,
            projectConfig
          }
        )
        expect(transformResult).toMatchSnapshot()
      })
    })
  })

  describe('compileDepStyles', function () {

  })
})
