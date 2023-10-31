const XRegExp = require('xregexp')

const template = /<template>([\s\S]+)<\/template>/gi
const platforms = {
  weapp: false,
  h5: false,
  rn: false,
  swan: false,
  alipay: false,
  tt: false,
  qq: false,
  jd: false,
  quickapp: false
}
if (process.env.TARO_ENV && platforms.hasOwnProperty(process.env.TARO_ENV)) {
  platforms[process.env.TARO_ENV] = true
}

module.exports = function (source) {
  let _source = ''
  if (template.test(source)) {
    _source = source.match(template)[0]
    const preprocessResult = preprocess(_source, platforms)
    return source.replace(template, preprocessResult)
  } else {
    return source
  }
}

function preprocess (src, context) {
  const ifTag = {
    start: '[ \t]*<!--[ \t]*#(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
    end: '[ \t]*<!(?:--)?[ \t]*#endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?'
  }
  return replaceRecursive(src, ifTag, function (startMatches, endMatches, include, recurse) {
    const variant = startMatches[1]
    const test = (startMatches[2] || '').trim()
    switch (variant) {
      case 'if':
      case 'ifdef':
        return testPasses(test, context) ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input)) : padContent(startMatches.input + include + endMatches.input)
      case 'ifndef':
        return !testPasses(test, context) ? (padContent(startMatches.input) + recurse(include) + padContent(endMatches.input)) : padContent(startMatches.input + include + endMatches.input)
      default:
        throw new Error('Unknown if variant ' + variant + '.')
    }
  })
}

const splitRE = /\r?\n/g
function padContent (content) {
  return Array(content.split(splitRE).length).join('\n')
}



function replaceRecursive (rv, rule, processor) {
  if (!rule.start || !rule.end) {
    throw new Error('Recursive rule must have start and end.')
  }

  const startRegex = new RegExp(rule.start, 'mi')
  const endRegex = new RegExp(rule.end, 'mi')

  function matchReplacePass (content) {
    let matches
    try {
      matches = XRegExp.matchRecursive(content, rule.start, rule.end, 'gmi', {
        valueNames: ['between', 'left', 'match', 'right']
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        `
template节点 条件编译失败,参考示例(注意 ifdef 与 endif 必须配对使用):
< !--  #ifdef % PLATFORM % -->
模板代码
< !--  #endif --> 
`
      )
      return content
    }

    const matchGroup = {
      left: null as RegExpExecArray | null,
      match: null as string | null,
      right: null as RegExpExecArray | null,
    }



    return matches.reduce(function (builder, match) {
      switch (match.name) {
        case 'between':
          builder += match.value
          break
        case 'left':
          matchGroup.left = startRegex.exec(match.value)
          break
        case 'match':
          matchGroup.match = match.value
          break
        case 'right':
          matchGroup.right = endRegex.exec(match.value)
          builder += processor(matchGroup.left, matchGroup.right, matchGroup.match, matchReplacePass)
          break
      }
      return builder
    }, '')
  }

  return matchReplacePass(rv)
}



function getTestTemplate (test) {
  test = test || 'true'
  test = test.trim()
  test = test.replace(/-/g, '_')
  // eslint-disable-next-line no-new, no-new-func
  return new Function('context', 'with (context||{}){ return ( ' + test + ' ); }')
}

function testPasses (test, context) {
  const testFn = getTestTemplate(test)
  try {
    return testFn(context, getDeepPropFromObj)
  } catch (e) {
    return false
  }
}


function getDeepPropFromObj (obj, propPath) {
  propPath.replace(/\[([^\]+?])\]/g, '.$1')
  propPath = propPath.split('.')

  if (propPath.length === 1) {
    return obj[propPath[0]]
  }

  propPath.some(function (pathSegment) {
    obj = obj[pathSegment]
    return (obj == null)
  })

  return obj
}