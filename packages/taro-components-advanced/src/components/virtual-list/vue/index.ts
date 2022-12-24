import List from './list'

export default {
  install: (Vue) => {
    Vue.component('virtual-list', List)
  }
}
