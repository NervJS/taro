import transform from '../src'
import { baseOptions, removeFrontBlank } from './utils'

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
