import Taro from '@tarojs/api'

// null-implementation
export const getLogManager: typeof Taro.getLogManager = () => {
  return new LogManager()
}

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