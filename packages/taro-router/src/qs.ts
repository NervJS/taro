export const qs = function () {
  const params = {}

  location.search.substr(1).split('&').forEach(pair => {
    const [key, value] = pair.split('=')
    params[key] = value
  })

  return params
}
