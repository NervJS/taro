import Taro from '@tarojs/api'

/**
 * 获取日志管理器对象
 * 
 * @canUse getLogManager
 * @null_implementation
 */
export const getLogManager: typeof Taro.getLogManager = () => {
  return new LogManager()
}

/**
 * 日志管理器
 * 
 * @canUse LogManager
 * @null_implementation
 */
class LogManager implements Taro.LogManager {
  debug (): void {

  }

  info (): void {

  }

  log (): void {

  }

  warn (): void {

  }
}