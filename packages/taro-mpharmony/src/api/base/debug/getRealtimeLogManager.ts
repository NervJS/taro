import Taro from '@tarojs/api'

/**
 * 获取实时日志管理器对象
 * 
 * @canUse getRealtimeLogManager
 * @null_implementation
 */
export const getRealtimeLogManager: typeof Taro.getRealtimeLogManager = () => {
  return new RealtimeLogManager()
}

/**
 * 实时日志管理器
 * 
 * @canUse RealtimeLogManager
 * @null_implementation
 */
class RealtimeLogManager implements Taro.RealtimeLogManager {

  addFilterMsg (): void {

  }

  error (): void {

  }

  in (): void {

  }

  info (): void {

  }

  setFilterMsg (): void {

  }

  tag (tagName: string): RealtimeTagLogManager {
    return new RealtimeTagLogManager(tagName)
  }

  warn (): void {

  }
}

/**
 * 给定标签的实时日志管理器
 * 
 * @canUse RealtimeTagLogManager
 * @null_implementation
 */
class RealtimeTagLogManager implements Taro.RealtimeTagLogManager {
  _tagName: string

  constructor (tagName: string) {
    this._tagName = tagName
  }

  addFilterMsg (_msg): void {

  }

  error (_key, _value): void {

  }

  info (_key, _value): void {

  }

  setFilterMsg (_msg): void {

  }
  
  warn (_key, _value): void {

  }
}