import transform from '../src'
import { baseOptions, removeBackslashesSerializer, removeFrontBlank } from './utils'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('base', () => {
  // 测试async、await转换后是否保持为async、await
  test('asyncTrans', () => {
    let originCode = `async function fetchData() {
      try {
        // 使用 await 关键字等待异步操作完成
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }`
    const { code } = transform({
      ...baseOptions,
      code: originCode,
    })
    expect(removeFrontBlank(code)).toEqual(removeFrontBlank(originCode))
  })
})
