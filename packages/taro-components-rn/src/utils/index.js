export const omit = function (obj = {}, fields = []) {
  const shallowCopy = { ...obj }
  fields.forEach((key) => {
    delete shallowCopy[key]
  })
  return shallowCopy
}

export default {
  omit
}
