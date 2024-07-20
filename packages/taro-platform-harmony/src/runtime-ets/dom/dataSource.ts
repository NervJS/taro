import { TaroEventTarget } from '../dom/eventTarget'

export default class TaroDataSourceElement extends TaroEventTarget implements IDataSource {
  protected listeners: DataChangeListener[] = []

  totalCount(): number {
    throw new Error('Method not implemented.')
  }

  getData(_: number) {
    throw new Error('Method not implemented.')
  }

  // 该方法为框架侧调用，为 LazyForEach 组件向其数据源处添加 listener 监听
  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener)
    }
  }

  // 该方法为框架侧调用，为对应的 LazyForEach 组件在数据源处去除 listener 监听
  unregisterDataChangeListener(listener: DataChangeListener): void {
    const pos = this.listeners.indexOf(listener)

    if (pos >= 0) {
      this.listeners.splice(pos, 1)
    }
  }

  // 通知 LazyForEach 组件需要重载所有子组件
  notifyDataReload(): void {
    this.listeners.forEach(listener => {
      listener.onDataReloaded()
    })
  }

  // 通知 LazyForEach 组件需要将 from 对应索引处的子组件移动到 to 索引处
  notifyDataMove(from: number, to: number): void {
    this.listeners.forEach(listener => {
      listener.onDataMove(from, to)
    })
  }

  // 通知 LazyForEach 组件需要在 index 对应索引处添加子组件
  notifyDataAdd(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataAdd(index)
    })
  }

  // 通知 LazyForEach 组件在 index 对应索引处数据有变化，需要重建该子组件
  notifyDataChange(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataChange(index)
    })
  }

  // 通知 LazyForEach 组件需要在 index 对应索引处删除该子组件
  notifyDataDelete(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataDelete(index)
    })
  }
}
