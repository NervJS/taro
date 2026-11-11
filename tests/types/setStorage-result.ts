import Taro from '../../packages/taro/types/index'

export async function readSuccess(): Promise<boolean | undefined> {
  const res = await Taro.setStorage({ key: 'user', data: { id: 1 } })
  return res.success
}
