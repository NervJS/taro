import { Status } from '../NativeApi'

export function displayExecRes (status: Status, method: string) {
  if (!status?.done) {
    console.error({ errMsg: `${method} execution fail: ` + status?.errorMsg })
  } else {
    /* empty */
  }
}

export function handleData (data) {
  const type = typeof data
  let obj = {}

  if (type === 'symbol') {
    obj = { data: '' }
  } else {
    obj = { data }
  }
  return obj
}
