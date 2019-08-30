const nameList = ['translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotateX', 'rotateY']

export default {
  'transform': (value, declaration, addDeclaration) => {
    const name = value.match(/\w+/)[0]
    if (!~nameList.indexOf(name)) {
      return 'I:'
    }
    if (~value.indexOf('%')) {
      return 'I:'
    }
    //不能同时出现translateX和translateY
    if(~value.indexOf('translateX') && ~value.indexOf('translateY')) {
      return 'I:'
    }
  }
}
