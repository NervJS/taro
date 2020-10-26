function setValue (index, value, addDeclaration) {
  const keyDate = ['animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count']
  const valueData = {
    'animation-duration': /^\d*\.?\d+(s|ms)$/,
    'animation-timing-function': /^(linear|ease|ease-in|ease-out|ease-in-out)$/,
    'animation-delay': /^\d*\.?\d+(s|ms)$/,
    'animation-iteration-count': /^(infinite|\d+)$/
  }
  if (valueData[keyDate[index]] && valueData[keyDate[index]].test(value)) {
    addDeclaration(keyDate[index], value)
  } else if (valueData[keyDate[1]].test(value)) {
    addDeclaration(keyDate[1], value)
  } else if (valueData[keyDate[3]].test(value)) {
    addDeclaration(keyDate[3], value)
  } else if (valueData[keyDate[0]].test(value)) {
    addDeclaration(keyDate[0], value)
  }
}

export default {
  animation: (value, declaration, addDeclaration) => {
    if (~value.indexOf('steps')) {
      value = value.replace(/steps.+end\)/, 'linear')
    }
    const list = value.split(/\s+/)
    addDeclaration('animation-name', list[0])
    for (let i = 1, len = list.length; i < len; i++) {
      setValue(i - 1, list[i], addDeclaration)
    }
    return 'I:'
  },
  'animation-name': '',
  'animation-duration': '',
  'animation-timing-function': (value, _declaration, _addDeclaration) => {
    const cont = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']
    if (~cont.indexOf(value)) {
      return ''
    }
    return 'I:'
  },
  'animation-delay': '',
  'animation-iteration-count': (value, _declaration, _addDeclaration) => {
    if (value === 'infinite') {
      return 'I:'
    }
    return ''
  },
  'animation-direction': 'I:',
  'animation-fill-mode': (value, _declaration, _addDeclaration) => {
    const list = ['none', 'forwards']
    if (~list.indexOf(value)) {
      return ''
    }
    return 'I:'
  }
}
