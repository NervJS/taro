import shallowEqual from './shallow-equal'

function addLeadingSlash (path) {
  return path.charAt(0) === '/' ? path : '/' + path
}

function getCurrentPageUrl () {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return addLeadingSlash(currentPage.route || currentPage.__route__)
}

export default {
  shallowEqual,
  getCurrentPageUrl
}

export {
  shallowEqual,
  getCurrentPageUrl
}
