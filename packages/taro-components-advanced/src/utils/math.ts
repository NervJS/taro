export function getMiddleNumber (...list: number[]) {
  return list.sort((a, b) => a - b)[Math.floor(list.length / 2)]
}

export function isCosDistributing (list: number[], datum = 0) {
  let flags = 0
  for(let i = 0; i < list.length - 1; i++) {
    if (getMiddleNumber(list[i], datum, list[i + 1]) === datum) {
      flags++
    }
  }

  return flags === list.length - 1
}
