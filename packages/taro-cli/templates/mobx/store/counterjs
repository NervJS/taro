import { observable } from 'mobx'

const counterStore = observable({
  counter: 0
})

counterStore.increment = function () {
  this.counter++
}

counterStore.decrement = function() {
  this.counter--
}

counterStore.incrementAsync = function() {
  setTimeout(() => {
    this.counter++
  }, 1000);
}

export default counterStore