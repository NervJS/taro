import { AppInstance, PageInstance } from './instance'
interface Router {
  params: Record<string, unknown>,
  path: string
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getCurrentInstance = () => Current
