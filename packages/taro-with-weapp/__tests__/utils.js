import { Component } from 'nervjs'

export class TaroComponent extends Component {
  $router = {
    params: {
      a: 1
    }
  }

  $scope = {}
}

export const delay = (fn) => {
  setTimeout(() => {
    fn()
  }, 0)
}
