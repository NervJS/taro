export default function (str) {
  str = str.replace(/__REACT_DEVTOOLS_GLOBAL_HOOK__/g, 'window.__REACT_DEVTOOLS_GLOBAL_HOOK__')
  return str
}
