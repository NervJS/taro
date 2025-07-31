import TestUtils from '@tarojs/test-utils-vue3'

describe('Testing', () => {

  test('Test', async () => {
    const testUtils = new TestUtils()
    await testUtils.createApp()
    await testUtils.PageLifecycle.onShow('pages/index/index')
    expect(testUtils.html()).toMatchSnapshot()
  })

})
