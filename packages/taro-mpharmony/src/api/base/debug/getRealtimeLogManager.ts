import Taro from '@tarojs/api'

// null-implementation
export const getRealtimeLogManager: typeof Taro.getRealtimeLogManager = () => {
  return new RealtimeLogManager()
}

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

  tag (): any {

  }

  warn (): void {

  }
}