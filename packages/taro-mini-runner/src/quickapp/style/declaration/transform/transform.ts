const nameList = ['translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotateX', 'rotateY']

export default {
  transform: (value) => {
    const name = value.match(/\w+/)[0]
    if (!~nameList.indexOf(name)) {
      return 'I:'
    }
    if (~value.indexOf('%')) {
      return 'I:'
    }
  }
}
