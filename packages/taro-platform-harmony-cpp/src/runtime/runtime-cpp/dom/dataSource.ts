import { TaroNode } from './node'

/** FIXME 后续删除 */
export class TaroDataSourceElement extends TaroNode implements IDataSource {
  protected listeners: DataChangeListener[] = []

  // 以下属性为半编译模式下才会赋值和使用的属性
  // 半编译节点更新触发器
  public _updateTrigger = 0
  // 是否为半编译模板下的节点
  public _isCompileMode = false
  // 是否为半编译模板下拥有自主更新权的节点
  public _isDynamicNode = false

  public findIndex (refChild?: TaroNode): number {
    return this.childNodes.findIndex(node => node._nid === refChild?._nid)
  }

  totalCount(): number {
    return this.childNodes?.length || 0
  }

  // 更新对应的 ArkUI 组件
  public updateComponent () {
    // 非半编译模式或者半编译模式下拥有自主更新权力的节点走 @State 的更新模式
    if (this._isDynamicNode || (!this._isCompileMode && this._instance)) {
      this._updateTrigger++
    } else {
      this.parentNode?.updateComponent?.()
    }
  }

  getData(index: number) {
    return this.childNodes[index] as TaroNode
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
