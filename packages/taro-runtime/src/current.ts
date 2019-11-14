import { AppInstance } from './dsl/instance'

interface Router {
  params: Record<string, unknown>
  path: string
}

interface Current {
  app: AppInstance | null,
  router: Router | null
}

export const Current: Current = {
  app: null,
  router: null
}
