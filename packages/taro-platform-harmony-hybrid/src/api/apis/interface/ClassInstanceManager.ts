import native from '../NativeApi'

export class ClassInstanceManager {
  private static INSTANCE: ClassInstanceManager
  private classIdMap: Map<string, number[]>
  constructor () {
    this.classIdMap = new Map<string, number[]>()
  }

  public static getInstance (): ClassInstanceManager {
    if (!ClassInstanceManager.INSTANCE) {
      ClassInstanceManager.INSTANCE = new ClassInstanceManager()
    }
    return ClassInstanceManager.INSTANCE
  }

  createInstance (className: string, option?: any) {
    const objectId: number = native.createInstance({ ...option, className: className })
    if (!this.classIdMap.has(className)) {
      this.classIdMap.set(className, [])
    }
    (this.classIdMap.get(className) as Array<number>).push(objectId)
    return objectId
  }

  getInstanceValue (className: string, name: string, objectId: number): any {
    return native.callInstance({
      type: 'get',
      className: className,
      property: name,
      objectId: objectId
    })
  }

  setInstanceValue (option: any, className: string, name: string, objectId: number): any {
    return native.callInstance({
      option: option,
      className: className,
      type: 'set',
      property: name,
      objectId: objectId
    })
  }

  setInstanceFunction (option: any, className: string, name: string, objectId: number): any {
    return native.callInstance({
      option: option,
      className: className,
      type: 'function',
      property: name,
      objectId: objectId
    })
  }

  setInstanceFunctionAsync (option: any, className: string, name: string, objectId: number): any {
    return native.callInstanceAsync({
      option: option,
      className: className,
      type: 'function',
      property: name,
      objectId: objectId
    })
  }

  destroyInstance (className: string, objectId: number) {
    const instances = this.classIdMap.get(className)
    if (instances) {
      const index = instances.indexOf(objectId)
      if (index !== -1) {
        instances.splice(index, 1)
      }
      native.syncAndReleaseInstance({ className: className, option: this.classIdMap.get(className) })
    }
  }
}
