import { AppInstance, PageInstance } from './dsl/instance'

interface Router {
  params: Record<string, unknown>,
  path: string,
  onReady: string,
  onHide: string,
  onShow: string
}

interface Current {
  app: AppInstance | null,
  router: Router | null,
  page: PageInstance | null
}

export const Current: Current = {
  app: null,
  router: null,
  page: null
}

export const getCurrentInstance = () => Current
