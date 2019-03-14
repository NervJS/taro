export interface IDependency {
  style: string[],
  script: string[],
  json: string[],
  media: string[]
}

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}
