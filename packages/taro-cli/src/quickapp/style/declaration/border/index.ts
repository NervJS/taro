function valueType (value) {
  const styles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
  // 需要考虑到0px简写为0的情况，否则会当作color处理。
  if (/px/ig.test(value) || parseInt(value) === 0 || value === 'none') {
    return 'width'
  } else if (~styles.indexOf(value)) {
    return 'style'
  } else {
    return 'color'
  }
}

function setStyle (direction, value, addDeclaration) {
  const values = value.split(' ')
  for (let i = 0, length = values.length; i < length; i++) {
    const borderProperty = `border-${direction}-${valueType(values[i])}`
    if (values[i] === 'none') {
      values[i] = '0'
    }
    if (/\S+style$/.test(borderProperty)) {
      addDeclaration('border-style', values[i])
    } else {
      addDeclaration(borderProperty, values[i])
    }
  }
  return 'I:'
}

function setWidth (value, declaration) {
  const styles = ['thin', 'medium', 'thick', 'inherit']
  const values = ['1px', '2px', '3px', '1px']
  var valueList = value.split(' ')
  value = valueList[0]
  if (~styles.indexOf(value)) {
    const index = styles.indexOf(value)
    console.log(index)
    value = values[index]
  }
  if (~value.indexOf('%')) {
    value = 750 / 100 * parseInt(value) + 'px'
  }
  declaration.value = value
}

export default {
  'border': (value, declaration, addDeclaration) => {
    if (value === 'none') {
      declaration.value = 0
    }
    return ''
  },
  'border-color': '',
  'border-style': '',
  'border-width': (value, declaration, addDeclaration) => { // width也不支持百分数，后期在转换
    setWidth(value, declaration)
  },
  'border-radius': (value, declaration, addDeclaration) => { // width也不支持百分数，后期在转换
    if (~value.indexOf(' ')) {
      return 'I:'
    }
    if (~value.indexOf('%')) {
      // 其实应当按照当前组件的宽高为基准计算，但这里拿不到，暂时这样处理下。
      value = 750 / 100 * parseInt(value) + 'px'
      declaration.value = value
    }
  },
  'border-top': (value, declaration, addDeclaration) => {
    return setStyle('top', value, addDeclaration)
  },
  'border-bottom': (value, declaration, addDeclaration) => {
    return setStyle('bottom', value, addDeclaration)
  },
  'border-left': (value, declaration, addDeclaration) => {
    return setStyle('left', value, addDeclaration)
  },
  'border-right': (value, declaration, addDeclaration) => {
    return setStyle('right', value, addDeclaration)
  },
  'border-left-width': (value, declaration, addDeclaration) => {
    setWidth(value, declaration)
  },
  'border-right-width': (value, declaration, addDeclaration) => {
    setWidth(value, declaration)
  },
  'border-top-width': (value, declaration, addDeclaration) => {
    setWidth(value, declaration)
  },
  'border-bottom-width': (value, declaration, addDeclaration) => {
    setWidth(value, declaration)
  },
  'border-left-color': '',
  'border-right-color': '',
  'border-top-color': '',
  'border-bottom-color': '',
  'border-left-radius': '',
  'border-right-radius': '',
  'border-top-radius': '',
  'border-bottom-radius': '',
  'border-top-style': 'I:',
  'border-bottom-style': 'I:',
  'border-left-style': 'I:',
  'border-right-style': 'I:'
}
