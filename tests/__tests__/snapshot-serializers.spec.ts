import { normalizeVueLoaderPath } from 'jest-taro-helper/dist/snapshot/serializers'

const expected = '"../../node_modules/.pnpm/vue-loader@17.4.2/node_modules/vue-loader/dist/exportHelper.js"'

describe('snapshot serializers', () => {
  test('should drop the long pnpm peer suffix of vue-loader', () => {
    const received = '"../../node_modules/.pnpm/vue-loader@17.4.2_webpack@5.104.1_@swc+core@1.3.96_lightningcss@1.29.3_postcss@8.5.6_/node_modules/vue-loader/dist/exportHelper.js"'
    expect(normalizeVueLoaderPath(received)).toBe(expected)
  })

  test('should drop the hashed Windows suffix of vue-loader', () => {
    const received = '"../../node_modules/.pnpm/vue-loader@17.4.2_webpack@5_d15f85f850b60f45564b4866c676c9f8/node_modules/vue-loader/dist/exportHelper.js"'
    expect(normalizeVueLoaderPath(received)).toBe(expected)
  })

  test('should leave other pnpm packages unchanged', () => {
    const received = '"../../node_modules/.pnpm/vue@3.4.0_typescript@5.4.5/node_modules/vue/index.js"'
    expect(normalizeVueLoaderPath(received)).toBe(received)
  })
})
