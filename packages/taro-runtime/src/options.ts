import type { Options } from './interface'

export const options: Options = {
  prerender: true,
  debug: false,
  perfConfig: {
    maxDataPathLength: 10,
    maxDataSize: 256,
    maxSetDataFrequency: 3
  }
}
