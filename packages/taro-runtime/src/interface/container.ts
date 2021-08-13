export enum ElementNames {
  Element = 'Element',
  Document = 'Document',
  RootElement = 'RootElement',
  FormElement = 'FormElement'
}

export interface InstanceFactory<T> {
  (...args: any[]): T
}

export interface InstanceNamedFactory {
  <T>(named: string): (...args: any[]) => T
}
