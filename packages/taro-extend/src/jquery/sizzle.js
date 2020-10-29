/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-const */
/*!
 * Sizzle CSS Selector Engine v@VERSION
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: @DATE
 */

import { window } from '@tarojs/runtime'

let i
let support
let Expr
let getText
let isXML
let tokenize
let compile
let select
let outermostContext
let sortInput
let hasDuplicate

// Local document vars
let setDocument
let _document
let docElem
let documentIsHTML
let rbuggyQSA
let rbuggyMatches
let matches
let contains

// Instance-specific data
const expando = 'sizzle' + 1 * new Date()
const preferredDoc = window.document
let dirruns = 0
let done = 0
const classCache = createCache()
const tokenCache = createCache()
const compilerCache = createCache()
const nonnativeSelectorCache = createCache()
let sortOrder = function (a, b) {
  if (a === b) {
    hasDuplicate = true
  }
  return 0
}

// Instance methods
const hasOwn = ({}).hasOwnProperty
let arr = []
const pop = arr.pop
const pushNative = arr.push
let push = arr.push
const slice = arr.slice

// Use a stripped-down indexOf as it's faster than native
// https://jsperf.com/thor-indexof-vs-for/5
const indexOf = function (list, elem) {
  let i = 0
  const len = list.length
  for (; i < len; i++) {
    if (list[i] === elem) {
      return i
    }
  }
  return -1
}

const booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|' +
      'ismap|loop|multiple|open|readonly|required|scoped'

// Regular expressions

// http://www.w3.org/TR/css3-selectors/#whitespace
const whitespace = '[\\x20\\t\\r\\n\\f]'

// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
const identifier = '(?:\\\\[\\da-fA-F]{1,6}' + whitespace +
      '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+'

// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
const attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace +

      // Operator (capture 2)
      '*([*^$|!~]?=)' + whitespace +

      // "Attribute values must be CSS identifiers [capture 5]
      // or strings [capture 3 or capture 4]"
      "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + '))|)' +
      whitespace + '*\\]'

const pseudos = ':(' + identifier + ')(?:\\((' +

      // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
      // 1. quoted (capture 3; capture 4 or capture 5)
      "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

      // 2. simple (capture 6)
      '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' +

      // 3. anything else (capture 2)
      '.*' +
      ')\\)|)'

// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
const rwhitespace = new RegExp(whitespace + '+', 'g')
const rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' +
      whitespace + '+$', 'g')

const rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*')
const rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace +
      '*')
const rdescend = new RegExp(whitespace + '|>')

const rpseudo = new RegExp(pseudos)
const ridentifier = new RegExp('^' + identifier + '$')

const matchExpr = {
  ID: new RegExp('^#(' + identifier + ')'),
  CLASS: new RegExp('^\\.(' + identifier + ')'),
  TAG: new RegExp('^(' + identifier + '|[*])'),
  ATTR: new RegExp('^' + attributes),
  PSEUDO: new RegExp('^' + pseudos),
  CHILD: new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
        whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' +
        whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
  bool: new RegExp('^(?:' + booleans + ')$', 'i'),

  // For use in libraries implementing .is()
  // We use this for POS matching in `select`
  needsContext: new RegExp('^' + whitespace +
        '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace +
        '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
}

const rhtml = /HTML$/i
const rinputs = /^(?:input|select|textarea|button)$/i
const rheader = /^h\d$/i

const rnative = /^[^{]+\{\s*\[native \w/

// Easily-parseable/retrievable ID or TAG or CLASS selectors
const rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/

const rsibling = /[+~]/

// CSS escapes
// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
const runescape = new RegExp('\\\\[\\da-fA-F]{1,6}' + whitespace + '?|\\\\([^\\r\\n\\f])', 'g')
const funescape = function (escape, nonHex) {
  const high = '0x' + escape.slice(1) - 0x10000

  return nonHex || (high < 0
    ? String.fromCharCode(high + 0x10000)
    : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00))
}

// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
// eslint-disable-next-line no-control-regex
const rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g
const fcssescape = function (ch, asCodePoint) {
  if (asCodePoint) {
    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
    if (ch === '\0') {
      return '\uFFFD'
    }

    // Control characters and (dependent upon position) numbers get escaped as code points
    return ch.slice(0, -1) + '\\' +
          ch.charCodeAt(ch.length - 1).toString(16) + ' '
  }

  // Other potentially-special ASCII characters get backslash-escaped
  return '\\' + ch
}

// Used for iframes
// See setDocument()
// Removing the function wrapper causes a "Permission Denied"
// error in IE
const unloadHandler = function () {
  setDocument()
}

const inDisabledFieldset = addCombinator(
  function (elem) {
    return elem.disabled === true && elem.nodeName.toLowerCase() === 'fieldset'
  },
  { dir: 'parentNode', next: 'legend' }
)

// Optimize for push.apply( _, NodeList )
try {
  push.apply(
    (arr = slice.call(preferredDoc.childNodes)),
    preferredDoc.childNodes
  )

  // Support: Android<4.0
  // Detect silently failing push.apply
  // eslint-disable-next-line no-unused-expressions
  arr[preferredDoc.childNodes.length].nodeType
} catch (e) {
  push = {
    apply: arr.length

      // Leverage slice if possible
      ? function (target, els) {
        pushNative.apply(target, slice.call(els))
      }

      // Support: IE<9
      // Otherwise append directly
      : function (target, els) {
        let j = target.length
        let i = 0

        // Can't trust NodeList.length
        while ((target[j++] = els[i++])) {}
        target.length = j - 1
      }
  }
}

export function Sizzle (selector, context, results, seed) {
  let m; let i; let elem; let nid; let match; let groups; let newSelector
  let newContext = context && context.ownerDocument

  // nodeType defaults to 9, since context defaults to document
  const nodeType = context ? context.nodeType : 9

  results = results || []

  // Return early from calls with invalid selector or context
  if (typeof selector !== 'string' || !selector ||
      nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
    return results
  }

  // Try to shortcut find operations (as opposed to filters) in HTML documents
  if (!seed) {
    setDocument(context)
    context = context || _document

    if (documentIsHTML) {
      // If the selector is sufficiently simple, try using a "get*By*" DOM method
      // (excepting DocumentFragment context, where the methods don't exist)
      if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
        // ID selector
        if ((m = match[1])) {
          // Document context
          if (nodeType === 9) {
            if ((elem = context.getElementById(m))) {
              // Support: IE, Opera, Webkit
              // TODO: identify versions
              // getElementById can match elements by name instead of ID
              if (elem.id === m) {
                results.push(elem)
                return results
              }
            } else {
              return results
            }

            // Element context
          } else {
            // Support: IE, Opera, Webkit
            // TODO: identify versions
            // getElementById can match elements by name instead of ID
            if (newContext && (elem = newContext.getElementById(m)) &&
                contains(context, elem) &&
                elem.id === m) {
              results.push(elem)
              return results
            }
          }

          // Type selector
        } else if (match[2]) {
          push.apply(results, context.getElementsByTagName(selector))
          return results

          // Class selector
        } else if ((m = match[3]) && support.getElementsByClassName &&
            context.getElementsByClassName) {
          push.apply(results, context.getElementsByClassName(m))
          return results
        }
      }

      // Take advantage of querySelectorAll
      if (support.qsa &&
          !nonnativeSelectorCache[selector + ' '] &&
          (!rbuggyQSA || !rbuggyQSA.test(selector)) &&

          // Support: IE 8 only
          // Exclude object elements
          (nodeType !== 1 || context.nodeName.toLowerCase() !== 'object')) {
        newSelector = selector
        newContext = context

        // qSA considers elements outside a scoping root when evaluating child or
        // descendant combinators, which is not what we want.
        // In such cases, we work around the behavior by prefixing every selector in the
        // list with an ID selector referencing the scope context.
        // The technique has to be used as well when a leading combinator is used
        // as such selectors are not recognized by querySelectorAll.
        // Thanks to Andrew Dupont for this technique.
        if (nodeType === 1 &&
            (rdescend.test(selector) || rcombinators.test(selector))) {
          // Expand context for sibling selectors
          newContext = rsibling.test(selector) && testContext(context.parentNode) ||
              context

          // We can use :scope instead of the ID hack if the browser
          // supports it & if we're not changing the context.
          if (newContext !== context || !support.scope) {
            // Capture the context ID, setting it first if necessary
            if ((nid = context.getAttribute('id'))) {
              nid = nid.replace(rcssescape, fcssescape)
            } else {
              context.setAttribute('id', (nid = expando))
            }
          }

          // Prefix every selector in the list
          groups = tokenize(selector)
          i = groups.length
          while (i--) {
            groups[i] = (nid ? '#' + nid : ':scope') + ' ' +
                toSelector(groups[i])
          }
          newSelector = groups.join(',')
        }

        try {
          push.apply(results,
            newContext.querySelectorAll(newSelector)
          )
          return results
        } catch (qsaError) {
          nonnativeSelectorCache(selector, true)
        } finally {
          if (nid === expando) {
            context.removeAttribute('id')
          }
        }
      }
    }
  }

  // All others
  return select(selector.replace(rtrim, '$1'), context, results, seed)
}

/**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   * property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   * deleting the oldest entry
   */
function createCache () {
  const keys = []

  function cache (key, value) {
    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    if (keys.push(key + ' ') > Expr.cacheLength) {
      // Only keep the most recent entries
      delete cache[keys.shift()]
    }
    return (cache[key + ' '] = value)
  }
  return cache
}

/**
   * Mark a function for special use by Sizzle
   * @param {Function} fn The function to mark
   */
function markFunction (fn) {
  fn[expando] = true
  return fn
}

/**
   * Support testing using an element
   * @param {Function} fn Passed the created element and returns a boolean result
   */
function assert (fn) {
  let el = _document.createElement('fieldset')

  try {
    return !!fn(el)
  } catch (e) {
    return false
  } finally {
    // Remove from its parent by default
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }

    // release memory in IE
    el = null
  }
}

/**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   */
function addHandle (attrs, handler) {
  const arr = attrs.split('|')
  let i = arr.length

  while (i--) {
    Expr.attrHandle[arr[i]] = handler
  }
}

/**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
function siblingCheck (a, b) {
  let cur = b && a
  const diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
        a.sourceIndex - b.sourceIndex

  // Use IE sourceIndex if available on both nodes
  if (diff) {
    return diff
  }

  // Check if b follows a
  if (cur) {
    while ((cur = cur.nextSibling)) {
      if (cur === b) {
        return -1
      }
    }
  }

  return a ? 1 : -1
}

/**
   * Returns a function to use in pseudos for input types
   * @param {String} type
   */
function createInputPseudo (type) {
  return function (elem) {
    const name = elem.nodeName.toLowerCase()
    return name === 'input' && elem.type === type
  }
}

/**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
function createButtonPseudo (type) {
  return function (elem) {
    const name = elem.nodeName.toLowerCase()
    return (name === 'input' || name === 'button') && elem.type === type
  }
}

/**
   * Returns a function to use in pseudos for :enabled/:disabled
   * @param {Boolean} disabled true for :disabled; false for :enabled
   */
function createDisabledPseudo (disabled) {
  // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
  return function (elem) {
    // Only certain elements can match :enabled or :disabled
    // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
    // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
    if ('form' in elem) {
      // Check for inherited disabledness on relevant non-disabled elements:
      // * listed form-associated elements in a disabled fieldset
      //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
      //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
      // * option elements in a disabled optgroup
      //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
      // All such elements have a "form" property.
      if (elem.parentNode && elem.disabled === false) {
        // Option elements defer to a parent optgroup if present
        if ('label' in elem) {
          if ('label' in elem.parentNode) {
            return elem.parentNode.disabled === disabled
          } else {
            return elem.disabled === disabled
          }
        }

        // Support: IE 6 - 11
        // Use the isDisabled shortcut property to check for disabled fieldset ancestors
        return elem.isDisabled === disabled ||

            // Where there is no isDisabled, check manually
            /* jshint -W018 */
            elem.isDisabled !== !disabled &&
            inDisabledFieldset(elem) === disabled
      }

      return elem.disabled === disabled

      // Try to winnow out elements that can't be disabled before trusting the disabled property.
      // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
      // even exist on them, let alone have a boolean value.
    } else if ('label' in elem) {
      return elem.disabled === disabled
    }

    // Remaining elements are neither :enabled nor :disabled
    return false
  }
}

/**
   * Returns a function to use in pseudos for positionals
   * @param {Function} fn
   */
function createPositionalPseudo (fn) {
  return markFunction(function (argument) {
    argument = +argument
    return markFunction(function (seed, matches) {
      let j
      const matchIndexes = fn([], seed.length, argument)
      let i = matchIndexes.length

      // Match elements found at the specified indexes
      while (i--) {
        if (seed[(j = matchIndexes[i])]) {
          seed[j] = !(matches[j] = seed[j])
        }
      }
    })
  })
}

/**
   * Checks a node for validity as a Sizzle context
   * @param {Element|Object=} context
   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
   */
function testContext (context) {
  return context && typeof context.getElementsByTagName !== 'undefined' && context
}

// Expose support vars for convenience
support = Sizzle.support = {}

/**
   * Detects XML nodes
   * @param {Element|Object} elem An element or a document
   * @returns {Boolean} True iff elem is a non-HTML XML node
   */
isXML = Sizzle.isXML = function (elem) {
  const namespace = elem.namespaceURI
  const docElem = (elem.ownerDocument || elem).documentElement

  // Support: IE <=8
  // Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
  // https://bugs.jquery.com/ticket/4833
  return !rhtml.test(namespace || docElem && docElem.nodeName || 'HTML')
}

/**
   * Sets document-related variables once based on the current document
   * @param {Element|Object} [doc] An element or document object to use to set the document
   * @returns {Object} Returns the current document
   */
setDocument = Sizzle.setDocument = function (node) {
  let hasCompare; let subWindow
  const doc = node ? node.ownerDocument || node : preferredDoc

  // Return early if doc is invalid or already selected
  // Support: IE 11+, Edge 17 - 18+
  // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
  // two documents; shallow comparisons work.
  // eslint-disable-next-line eqeqeq
  if (doc == _document || doc.nodeType !== 9 || !doc.documentElement) {
    return _document
  }

  // Update global variables
  _document = doc
  docElem = _document.documentElement
  documentIsHTML = !isXML(_document)

  // Support: IE 9 - 11+, Edge 12 - 18+
  // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
  // Support: IE 11+, Edge 17 - 18+
  // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
  // two documents; shallow comparisons work.
  // eslint-disable-next-line eqeqeq
  if (preferredDoc != _document &&
      (subWindow = _document.defaultView) && subWindow.top !== subWindow) {
    // Support: IE 11, Edge
    if (subWindow.addEventListener) {
      subWindow.addEventListener('unload', unloadHandler, false)

      // Support: IE 9 - 10 only
    } else if (subWindow.attachEvent) {
      subWindow.attachEvent('onunload', unloadHandler)
    }
  }

  // Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
  // Safari 4 - 5 only, Opera <=11.6 - 12.x only
  // IE/Edge & older browsers don't support the :scope pseudo-class.
  // Support: Safari 6.0 only
  // Safari 6.0 supports :scope but it's an alias of :root there.
  support.scope = false
  /* Attributes
    ---------------------------------------------------------------------- */

  // Support: IE<8
  // Verify that getAttribute really returns attributes and not properties
  // (excepting IE8 booleans)
  support.attributes = assert(function (el) {
    el.className = 'i'
    return !el.getAttribute('className')
  })

  /* getElement(s)By*
    ---------------------------------------------------------------------- */

  // Check if getElementsByTagName("*") returns only elements
  support.getElementsByTagName = true

  // Support: IE<9
  support.getElementsByClassName = true

  // Support: IE<10
  // Check if getElementById returns elements by name
  // The broken getElementById methods don't pick up programmatically-set names,
  // so use a roundabout getElementsByName test
  support.getById = true

  // ID filter and find
  if (support.getById) {
    Expr.filter.ID = function (id) {
      const attrId = id.replace(runescape, funescape)
      return function (elem) {
        return elem.getAttribute('id') === attrId
      }
    }
    Expr.find.ID = function (id, context) {
      if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
        const elem = context.getElementById(id)
        return elem ? [elem] : []
      }
    }
  } else {
    Expr.filter.ID = function (id) {
      const attrId = id.replace(runescape, funescape)
      return function (elem) {
        const node = typeof elem.getAttributeNode !== 'undefined' &&
            elem.getAttributeNode('id')
        return node && node.value === attrId
      }
    }

    // Support: IE 6 - 7 only
    // getElementById is not reliable as a find shortcut
    Expr.find.ID = function (id, context) {
      if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
        let node; let i; let elems
        let elem = context.getElementById(id)

        if (elem) {
          // Verify the id attribute
          node = elem.getAttributeNode('id')
          if (node && node.value === id) {
            return [elem]
          }

          // Fall back on getElementsByName
          elems = context.getElementsByName(id)
          i = 0
          while ((elem = elems[i++])) {
            node = elem.getAttributeNode('id')
            if (node && node.value === id) {
              return [elem]
            }
          }
        }

        return []
      }
    }
  }

  // Tag
  Expr.find.TAG = support.getElementsByTagName
    ? function (tag, context) {
      if (typeof context.getElementsByTagName !== 'undefined') {
        return context.getElementsByTagName(tag)

        // DocumentFragment nodes don't have gEBTN
      } else if (support.qsa) {
        return context.querySelectorAll(tag)
      }
    }

    : function (tag, context) {
      let elem
      const tmp = []
      let i = 0

      // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
      const results = context.getElementsByTagName(tag)

      // Filter out possible comments
      if (tag === '*') {
        while ((elem = results[i++])) {
          if (elem.nodeType === 1) {
            tmp.push(elem)
          }
        }

        return tmp
      }
      return results
    }

  // Class
  Expr.find.CLASS = support.getElementsByClassName && function (className, context) {
    if (typeof context.getElementsByClassName !== 'undefined' && documentIsHTML) {
      return context.getElementsByClassName(className)
    }
  }

  /* QSA/matchesSelector
    ---------------------------------------------------------------------- */

  // QSA and matchesSelector support

  // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
  rbuggyMatches = []

  // qSa(:focus) reports false when true (Chrome 21)
  // We allow this because of a bug in IE8/9 that throws an error
  // whenever `document.activeElement` is accessed on an iframe
  // So, we allow :focus to pass through QSA all the time to avoid the IE error
  // See https://bugs.jquery.com/ticket/13378
  rbuggyQSA = []

  rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'))
  rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'))

  /* Contains
    ---------------------------------------------------------------------- */
  hasCompare = rnative.test(docElem.compareDocumentPosition)

  // Element contains another
  // Purposefully self-exclusive
  // As in, an element does not contain itself
  contains = hasCompare || rnative.test(docElem.contains)
    ? function (a, b) {
      const adown = a.nodeType === 9 ? a.documentElement : a
      const bup = b && b.parentNode
      return a === bup || !!(bup && bup.nodeType === 1 && (
        adown.contains
          ? adown.contains(bup)
          : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
      ))
    }
    : function (a, b) {
      if (b) {
        while ((b = b.parentNode)) {
          if (b === a) {
            return true
          }
        }
      }
      return false
    }

  /* Sorting
    ---------------------------------------------------------------------- */

  // Document order sorting
  sortOrder = hasCompare
    ? function (a, b) {
      // Flag for duplicate removal
      if (a === b) {
        hasDuplicate = true
        return 0
      }

      // Sort on method existence if only one input has compareDocumentPosition
      let compare = !a.compareDocumentPosition - !b.compareDocumentPosition
      if (compare) {
        return compare
      }

      // Calculate position if both inputs belong to the same document
      // Support: IE 11+, Edge 17 - 18+
      // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
      // two documents; shallow comparisons work.
      // eslint-disable-next-line eqeqeq
      compare = (a.ownerDocument || a) == (b.ownerDocument || b)
        ? a.compareDocumentPosition(b)

        // Otherwise we know they are disconnected
        : 1

      // Disconnected nodes
      if (compare & 1 ||
        (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
        // Choose the first element that is related to our preferred document
        // Support: IE 11+, Edge 17 - 18+
        // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        if (a == _document || a.ownerDocument == preferredDoc &&
          contains(preferredDoc, a)) {
          return -1
        }

        // Support: IE 11+, Edge 17 - 18+
        // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        if (b == _document || b.ownerDocument == preferredDoc &&
          contains(preferredDoc, b)) {
          return 1
        }

        // Maintain original order
        return sortInput
          ? (indexOf(sortInput, a) - indexOf(sortInput, b))
          : 0
      }

      return compare & 4 ? -1 : 1
    }
    : function (a, b) {
      // Exit early if the nodes are identical
      if (a === b) {
        hasDuplicate = true
        return 0
      }

      let cur
      let i = 0
      const aup = a.parentNode
      const bup = b.parentNode
      const ap = [a]
      const bp = [b]

      // Parentless nodes are either documents or disconnected
      if (!aup || !bup) {
        // Support: IE 11+, Edge 17 - 18+
        // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        /* eslint-disable eqeqeq */
        return a == _document ? -1
          : b == _document ? 1
            /* eslint-enable eqeqeq */
            : aup ? -1
              : bup ? 1
                : sortInput
                  ? (indexOf(sortInput, a) - indexOf(sortInput, b))
                  : 0

        // If the nodes are siblings, we can do a quick check
      } else if (aup === bup) {
        return siblingCheck(a, b)
      }

      // Otherwise we need full lists of their ancestors for comparison
      cur = a
      while ((cur = cur.parentNode)) {
        ap.unshift(cur)
      }
      cur = b
      while ((cur = cur.parentNode)) {
        bp.unshift(cur)
      }

      // Walk down the tree looking for a discrepancy
      while (ap[i] === bp[i]) {
        i++
      }

      return i

        // Do a sibling check if the nodes have a common ancestor
        ? siblingCheck(ap[i], bp[i])

        // Otherwise nodes in our document sort first
        // Support: IE 11+, Edge 17 - 18+
        // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        /* eslint-disable eqeqeq */
        : ap[i] == preferredDoc ? -1
          : bp[i] == preferredDoc ? 1
            /* eslint-enable eqeqeq */
            : 0
    }

  return _document
}

Sizzle.matches = function (expr, elements) {
  return Sizzle(expr, null, null, elements)
}

Sizzle.matchesSelector = function (elem, expr) {
  setDocument(elem)

  if (support.matchesSelector && documentIsHTML &&
      !nonnativeSelectorCache[expr + ' '] &&
      (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
      (!rbuggyQSA || !rbuggyQSA.test(expr))) {
    try {
      const ret = matches.call(elem, expr)

      // IE 9's matchesSelector returns false on disconnected nodes
      if (ret || support.disconnectedMatch ||

          // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11) {
        return ret
      }
    } catch (e) {
      nonnativeSelectorCache(expr, true)
    }
  }

  return Sizzle(expr, _document, null, [elem]).length > 0
}

Sizzle.contains = function (context, elem) {
  // Set document vars if needed
  // Support: IE 11+, Edge 17 - 18+
  // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
  // two documents; shallow comparisons work.
  // eslint-disable-next-line eqeqeq
  if ((context.ownerDocument || context) != _document) {
    setDocument(context)
  }
  return contains(context, elem)
}

Sizzle.attr = function (elem, name) {
  // Set document vars if needed
  // Support: IE 11+, Edge 17 - 18+
  // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
  // two documents; shallow comparisons work.
  // eslint-disable-next-line eqeqeq
  if ((elem.ownerDocument || elem) != _document) {
    setDocument(elem)
  }

  const fn = Expr.attrHandle[name.toLowerCase()]

  // Don't get fooled by Object.prototype properties (jQuery #13807)
  let val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase())
    ? fn(elem, name, !documentIsHTML)
    : undefined

  return val !== undefined
    ? val
    : support.attributes || !documentIsHTML
      ? elem.getAttribute(name)
      : (val = elem.getAttributeNode(name)) && val.specified
        ? val.value
        : null
}

Sizzle.escape = function (sel) {
  return (sel + '').replace(rcssescape, fcssescape)
}

Sizzle.error = function (msg) {
  throw new Error('Syntax error, unrecognized expression: ' + msg)
}

/**
   * Document sorting and removing duplicates
   * @param {ArrayLike} results
   */
Sizzle.uniqueSort = function (results) {
  let elem
  const duplicates = []
  let j = 0
  let i = 0

  // Unless we *know* we can detect duplicates, assume their presence
  hasDuplicate = !support.detectDuplicates
  sortInput = !support.sortStable && results.slice(0)
  results.sort(sortOrder)

  if (hasDuplicate) {
    while ((elem = results[i++])) {
      if (elem === results[i]) {
        j = duplicates.push(i)
      }
    }
    while (j--) {
      results.splice(duplicates[j], 1)
    }
  }

  // Clear input after sorting to release objects
  // See https://github.com/jquery/sizzle/pull/225
  sortInput = null

  return results
}

/**
   * Utility function for retrieving the text value of an array of DOM nodes
   * @param {Array|Element} elem
   */
getText = Sizzle.getText = function (elem) {
  let node
  let ret = ''
  let i = 0
  const nodeType = elem.nodeType

  if (!nodeType) {
    // If no nodeType, this is expected to be an array
    while ((node = elem[i++])) {
      // Do not traverse comment nodes
      ret += getText(node)
    }
  } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
    // Use textContent for elements
    // innerText usage removed for consistency of new lines (jQuery #11153)
    if (typeof elem.textContent === 'string') {
      return elem.textContent
    } else {
      // Traverse its children
      for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
        ret += getText(elem)
      }
    }
  } else if (nodeType === 3 || nodeType === 4) {
    return elem.nodeValue
  }

  // Do not include comment or processing instruction nodes

  return ret
}

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  attrHandle: {},

  find: {},

  relative: {
    '>': { dir: 'parentNode', first: true },
    ' ': { dir: 'parentNode' },
    '+': { dir: 'previousSibling', first: true },
    '~': { dir: 'previousSibling' }
  },

  preFilter: {
    ATTR: function (match) {
      match[1] = match[1].replace(runescape, funescape)

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = (match[3] || match[4] ||
          match[5] || '').replace(runescape, funescape)

      if (match[2] === '~=') {
        match[3] = ' ' + match[3] + ' '
      }

      return match.slice(0, 4)
    },

    CHILD: function (match) {
      /* matches from matchExpr["CHILD"]
          1 type (only|nth|...)
          2 what (child|of-type)
          3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
          4 xn-component of xn+y argument ([+-]?\d*n|)
          5 sign of xn-component
          6 x of xn-component
          7 sign of y-component
          8 y of y-component
        */
      match[1] = match[1].toLowerCase()

      if (match[1].slice(0, 3) === 'nth') {
        // nth-* requires argument
        if (!match[3]) {
          Sizzle.error(match[0])
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[4] = +(match[4]
          ? match[5] + (match[6] || 1)
          : 2 * (match[3] === 'even' || match[3] === 'odd'))
        match[5] = +((match[7] + match[8]) || match[3] === 'odd')

        // other types prohibit arguments
      } else if (match[3]) {
        Sizzle.error(match[0])
      }

      return match
    },

    PSEUDO: function (match) {
      let excess
      const unquoted = !match[6] && match[2]

      if (matchExpr.CHILD.test(match[0])) {
        return null
      }

      // Accept quoted arguments as-is
      if (match[3]) {
        match[2] = match[4] || match[5] || ''

        // Strip excess characters from unquoted arguments
      } else if (unquoted && rpseudo.test(unquoted) &&

          // Get excess from tokenize (recursively)
          (excess = tokenize(unquoted, true)) &&

          // advance to the next closing parenthesis
          (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
        // excess is a negative index
        match[0] = match[0].slice(0, excess)
        match[2] = unquoted.slice(0, excess)
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice(0, 3)
    }
  },

  filter: {

    TAG: function (nodeNameSelector) {
      const nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase()
      return nodeNameSelector === '*'
        ? function () {
          return true
        }
        : function (elem) {
          return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
        }
    },

    CLASS: function (className) {
      let pattern = classCache[className + ' ']

      return pattern ||
          (pattern = new RegExp('(^|' + whitespace +
            ')' + className + '(' + whitespace + '|$)')) && classCache(
            className, function (elem) {
              return pattern.test(
                typeof elem.className === 'string' && elem.className ||
                  typeof elem.getAttribute !== 'undefined' &&
                    elem.getAttribute('class') ||
                  ''
              )
            })
    },

    ATTR: function (name, operator, check) {
      return function (elem) {
        let result = Sizzle.attr(elem, name)

        if (result == null) {
          return operator === '!='
        }
        if (!operator) {
          return true
        }

        result += ''

        /* eslint-disable max-len */

        return operator === '=' ? result === check
          : operator === '!=' ? result !== check
            : operator === '^=' ? check && result.indexOf(check) === 0
              : operator === '*=' ? check && result.indexOf(check) > -1
                : operator === '$=' ? check && result.slice(-check.length) === check
                  : operator === '~=' ? (' ' + result.replace(rwhitespace, ' ') + ' ').indexOf(check) > -1
                    : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-'
                      : false
        /* eslint-enable max-len */
      }
    },

    CHILD: function (type, what, _argument, first, last) {
      const simple = type.slice(0, 3) !== 'nth'
      const forward = type.slice(-4) !== 'last'
      const ofType = what === 'of-type'

      return first === 1 && last === 0

      // Shortcut for :nth-*(n)
        ? function (elem) {
          return !!elem.parentNode
        }

        : function (elem, _context, xml) {
          let cache; let uniqueCache; let outerCache; let node; let nodeIndex; let start
          let dir = simple !== forward ? 'nextSibling' : 'previousSibling'
          const parent = elem.parentNode
          const name = ofType && elem.nodeName.toLowerCase()
          const useCache = !xml && !ofType
          let diff = false

          if (parent) {
            // :(first|last|only)-(child|of-type)
            if (simple) {
              while (dir) {
                node = elem
                while ((node = node[dir])) {
                  if (ofType
                    ? node.nodeName.toLowerCase() === name
                    : node.nodeType === 1) {
                    return false
                  }
                }

                // Reverse direction for :only-* (if we haven't yet done so)
                start = dir = type === 'only' && !start && 'nextSibling'
              }
              return true
            }

            start = [forward ? parent.firstChild : parent.lastChild]

            // non-xml :nth-child(...) stores cache data on `parent`
            if (forward && useCache) {
              // Seek `elem` from a previously-cached index

              // ...in a gzip-friendly way
              node = parent
              outerCache = node[expando] || (node[expando] = {})

              // Support: IE <9 only
              // Defend against cloned attroperties (jQuery gh-1709)
              uniqueCache = outerCache[node.uniqueID] ||
                  (outerCache[node.uniqueID] = {})

              cache = uniqueCache[type] || []
              nodeIndex = cache[0] === dirruns && cache[1]
              diff = nodeIndex && cache[2]
              node = nodeIndex && parent.childNodes[nodeIndex]

              while ((node = ++nodeIndex && node && node[dir] ||

                  // Fallback to seeking `elem` from the start
                  (diff = nodeIndex = 0) || start.pop())) {
                // When found, cache indexes on `parent` and break
                if (node.nodeType === 1 && ++diff && node === elem) {
                  uniqueCache[type] = [dirruns, nodeIndex, diff]
                  break
                }
              }
            } else {
              // Use previously-cached element index if available
              if (useCache) {
                // ...in a gzip-friendly way
                node = elem
                outerCache = node[expando] || (node[expando] = {})

                // Support: IE <9 only
                // Defend against cloned attroperties (jQuery gh-1709)
                uniqueCache = outerCache[node.uniqueID] ||
                    (outerCache[node.uniqueID] = {})

                cache = uniqueCache[type] || []
                nodeIndex = cache[0] === dirruns && cache[1]
                diff = nodeIndex
              }

              // xml :nth-child(...)
              // or :nth-last-child(...) or :nth(-last)?-of-type(...)
              if (diff === false) {
                // Use the same loop as above to seek `elem` from the start
                while ((node = ++nodeIndex && node && node[dir] ||
                    (diff = nodeIndex = 0) || start.pop())) {
                  if ((ofType
                    ? node.nodeName.toLowerCase() === name
                    : node.nodeType === 1) &&
                      ++diff) {
                    // Cache the index of each encountered element
                    if (useCache) {
                      outerCache = node[expando] ||
                          (node[expando] = {})

                      // Support: IE <9 only
                      // Defend against cloned attroperties (jQuery gh-1709)
                      uniqueCache = outerCache[node.uniqueID] ||
                          (outerCache[node.uniqueID] = {})

                      uniqueCache[type] = [dirruns, diff]
                    }

                    if (node === elem) {
                      break
                    }
                  }
                }
              }
            }

            // Incorporate the offset, then check against cycle size
            diff -= last
            return diff === first || (diff % first === 0 && diff / first >= 0)
          }
        }
    },

    PSEUDO: function (pseudo, argument) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      let args
      const fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
            Sizzle.error('unsupported pseudo: ' + pseudo)

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if (fn[expando]) {
        return fn(argument)
      }

      // But maintain support for old signatures
      if (fn.length > 1) {
        args = [pseudo, pseudo, '', argument]
        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())
          ? markFunction(function (seed, matches) {
            let idx
            const matched = fn(seed, argument)
            let i = matched.length
            while (i--) {
              idx = indexOf(seed, matched[i])
              seed[idx] = !(matches[idx] = matched[i])
            }
          })
          : function (elem) {
            return fn(elem, 0, args)
          }
      }

      return fn
    }
  },

  pseudos: {

    // Potentially complex pseudos
    not: markFunction(function (selector) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      const input = []
      const results = []
      const matcher = compile(selector.replace(rtrim, '$1'))

      return matcher[expando]
        ? markFunction(function (seed, matches, _context, xml) {
          let elem
          const unmatched = matcher(seed, null, xml, [])
          let i = seed.length

          // Match elements unmatched by `matcher`
          while (i--) {
            if ((elem = unmatched[i])) {
              seed[i] = !(matches[i] = elem)
            }
          }
        })
        : function (elem, _context, xml) {
          input[0] = elem
          matcher(input, null, xml, results)

          // Don't keep the element (issue #299)
          input[0] = null
          return !results.pop()
        }
    }),

    has: markFunction(function (selector) {
      return function (elem) {
        return Sizzle(selector, elem).length > 0
      }
    }),

    contains: markFunction(function (text) {
      text = text.replace(runescape, funescape)
      return function (elem) {
        return (elem.textContent || getText(elem)).indexOf(text) > -1
      }
    }),

    // "Whether an element is represented by a :lang() selector
    // is based solely on the element's language value
    // being equal to the identifier C,
    // or beginning with the identifier C immediately followed by "-".
    // The matching of C against the element's language value is performed case-insensitively.
    // The identifier C does not have to be a valid language name."
    // http://www.w3.org/TR/selectors/#lang-pseudo
    lang: markFunction(function (lang) {
      // lang value must be a valid identifier
      if (!ridentifier.test(lang || '')) {
        Sizzle.error('unsupported lang: ' + lang)
      }
      lang = lang.replace(runescape, funescape).toLowerCase()
      return function (elem) {
        let elemLang
        do {
          if ((elemLang = documentIsHTML
            ? elem.lang
            : elem.getAttribute('xml:lang') || elem.getAttribute('lang'))) {
            elemLang = elemLang.toLowerCase()
            return elemLang === lang || elemLang.indexOf(lang + '-') === 0
          }
        } while ((elem = elem.parentNode) && elem.nodeType === 1)
        return false
      }
    }),

    // Miscellaneous
    target: function (elem) {
      const hash = window.location && window.location.hash
      return hash && hash.slice(1) === elem.id
    },

    root: function (elem) {
      return elem === docElem
    },

    focus: function (elem) {
      return elem === _document.activeElement &&
          (!_document.hasFocus || _document.hasFocus()) &&
          !!(elem.type || elem.href || ~elem.tabIndex)
    },

    // Boolean properties
    enabled: createDisabledPseudo(false),
    disabled: createDisabledPseudo(true),

    checked: function (elem) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      const nodeName = elem.nodeName.toLowerCase()
      return (nodeName === 'input' && !!elem.checked) ||
          (nodeName === 'option' && !!elem.selected)
    },

    selected: function (elem) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if (elem.parentNode) {
        // eslint-disable-next-line no-unused-expressions
        elem.parentNode.selectedIndex
      }

      return elem.selected === true
    },

    // Contents
    empty: function (elem) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
      //   but not by others (comment: 8; processing instruction: 7; etc.)
      // nodeType < 6 works because attributes (2) do not appear as children
      for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
        if (elem.nodeType < 6) {
          return false
        }
      }
      return true
    },

    parent: function (elem) {
      return !Expr.pseudos.empty(elem)
    },

    // Element/input types
    header: function (elem) {
      return rheader.test(elem.nodeName)
    },

    input: function (elem) {
      return rinputs.test(elem.nodeName)
    },

    button: function (elem) {
      const name = elem.nodeName.toLowerCase()
      return name === 'input' && elem.type === 'button' || name === 'button'
    },

    text: function (elem) {
      let attr
      return elem.nodeName.toLowerCase() === 'input' &&
          elem.type === 'text' &&

          // Support: IE<8
          // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
          ((attr = elem.getAttribute('type')) == null ||
            attr.toLowerCase() === 'text')
    },

    // Position-in-collection
    first: createPositionalPseudo(function () {
      return [0]
    }),

    last: createPositionalPseudo(function (_matchIndexes, length) {
      return [length - 1]
    }),

    eq: createPositionalPseudo(function (_matchIndexes, length, argument) {
      return [argument < 0 ? argument + length : argument]
    }),

    even: createPositionalPseudo(function (matchIndexes, length) {
      let i = 0
      for (; i < length; i += 2) {
        matchIndexes.push(i)
      }
      return matchIndexes
    }),

    odd: createPositionalPseudo(function (matchIndexes, length) {
      let i = 1
      for (; i < length; i += 2) {
        matchIndexes.push(i)
      }
      return matchIndexes
    }),

    lt: createPositionalPseudo(function (matchIndexes, length, argument) {
      let i = argument < 0
        ? argument + length
        : argument > length
          ? length
          : argument
      for (; --i >= 0;) {
        matchIndexes.push(i)
      }
      return matchIndexes
    }),

    gt: createPositionalPseudo(function (matchIndexes, length, argument) {
      let i = argument < 0 ? argument + length : argument
      for (; ++i < length;) {
        matchIndexes.push(i)
      }
      return matchIndexes
    })
  }
}

Expr.pseudos.nth = Expr.pseudos.eq

// Add button/input type pseudos
for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
  Expr.pseudos[i] = createInputPseudo(i)
}
for (i in { submit: true, reset: true }) {
  Expr.pseudos[i] = createButtonPseudo(i)
}

// Easy API for creating new setFilters
function setFilters () {}
setFilters.prototype = Expr.filters = Expr.pseudos
// eslint-disable-next-line new-cap
Expr.setFilters = new setFilters()

tokenize = Sizzle.tokenize = function (selector, parseOnly) {
  let matched; let match; let tokens; let type
  let soFar; let groups; let preFilters
  const cached = tokenCache[selector + ' ']

  if (cached) {
    return parseOnly ? 0 : cached.slice(0)
  }

  soFar = selector
  groups = []
  preFilters = Expr.preFilter

  while (soFar) {
    // Comma and first run
    if (!matched || (match = rcomma.exec(soFar))) {
      if (match) {
        // Don't consume trailing commas as valid
        soFar = soFar.slice(match[0].length) || soFar
      }
      groups.push((tokens = []))
    }

    matched = false

    // Combinators
    if ((match = rcombinators.exec(soFar))) {
      matched = match.shift()
      tokens.push({
        value: matched,

        // Cast descendant combinators to space
        type: match[0].replace(rtrim, ' ')
      })
      soFar = soFar.slice(matched.length)
    }

    // Filters
    for (type in Expr.filter) {
      if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
          (match = preFilters[type](match)))) {
        matched = match.shift()
        tokens.push({
          value: matched,
          type: type,
          matches: match
        })
        soFar = soFar.slice(matched.length)
      }
    }

    if (!matched) {
      break
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly
    ? soFar.length
    : soFar
      ? Sizzle.error(selector)

    // Cache the tokens
      : tokenCache(selector, groups).slice(0)
}

function toSelector (tokens) {
  let i = 0
  const len = tokens.length
  let selector = ''
  for (; i < len; i++) {
    selector += tokens[i].value
  }
  return selector
}

function addCombinator (matcher, combinator, base) {
  const dir = combinator.dir
  const skip = combinator.next
  const key = skip || dir
  const checkNonElements = base && key === 'parentNode'
  const doneName = done++

  return combinator.first

  // Check against closest ancestor/preceding element
    ? function (elem, context, xml) {
      while ((elem = elem[dir])) {
        if (elem.nodeType === 1 || checkNonElements) {
          return matcher(elem, context, xml)
        }
      }
      return false
    }

  // Check against all ancestor/preceding elements
    : function (elem, context, xml) {
      let oldCache; let uniqueCache; let outerCache
      const newCache = [dirruns, doneName]

      // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
      if (xml) {
        while ((elem = elem[dir])) {
          if (elem.nodeType === 1 || checkNonElements) {
            if (matcher(elem, context, xml)) {
              return true
            }
          }
        }
      } else {
        while ((elem = elem[dir])) {
          if (elem.nodeType === 1 || checkNonElements) {
            outerCache = elem[expando] || (elem[expando] = {})

            // Support: IE <9 only
            // Defend against cloned attroperties (jQuery gh-1709)
            uniqueCache = outerCache[elem.uniqueID] ||
                (outerCache[elem.uniqueID] = {})

            if (skip && skip === elem.nodeName.toLowerCase()) {
              elem = elem[dir] || elem
            } else if ((oldCache = uniqueCache[key]) &&
                oldCache[0] === dirruns && oldCache[1] === doneName) {
              // Assign to newCache so results back-propagate to previous elements
              return (newCache[2] = oldCache[2])
            } else {
              // Reuse newcache so results back-propagate to previous elements
              uniqueCache[key] = newCache

              // A match means we're done; a fail means we have to keep checking
              if ((newCache[2] = matcher(elem, context, xml))) {
                return true
              }
            }
          }
        }
      }
      return false
    }
}

function elementMatcher (matchers) {
  return matchers.length > 1
    ? function (elem, context, xml) {
      let i = matchers.length
      while (i--) {
        if (!matchers[i](elem, context, xml)) {
          return false
        }
      }
      return true
    }
    : matchers[0]
}

function multipleContexts (selector, contexts, results) {
  let i = 0
  const len = contexts.length
  for (; i < len; i++) {
    Sizzle(selector, contexts[i], results)
  }
  return results
}

function condense (unmatched, map, filter, context, xml) {
  let elem
  const newUnmatched = []
  let i = 0
  const len = unmatched.length
  const mapped = map != null

  for (; i < len; i++) {
    if ((elem = unmatched[i])) {
      if (!filter || filter(elem, context, xml)) {
        newUnmatched.push(elem)
        if (mapped) {
          map.push(i)
        }
      }
    }
  }

  return newUnmatched
}

function setMatcher (preFilter, selector, matcher, postFilter, postFinder, postSelector) {
  if (postFilter && !postFilter[expando]) {
    postFilter = setMatcher(postFilter)
  }
  if (postFinder && !postFinder[expando]) {
    postFinder = setMatcher(postFinder, postSelector)
  }
  return markFunction(function (seed, results, context, xml) {
    let temp; let i; let elem
    const preMap = []
    const postMap = []
    const preexisting = results.length

    // Get initial elements from seed or context
    const elems = seed || multipleContexts(
      selector || '*',
      context.nodeType ? [context] : context,
      []
    )

    // Prefilter to get matcher input, preserving a map for seed-results synchronization
    const matcherIn = preFilter && (seed || !selector)
      ? condense(elems, preMap, preFilter, context, xml)
      : elems

    let matcherOut = matcher

      // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
      ? postFinder || (seed ? preFilter : preexisting || postFilter)

        // ...intermediate processing is necessary
        ? []

        // ...otherwise use results directly
        : results
      : matcherIn

    // Find primary matches
    if (matcher) {
      matcher(matcherIn, matcherOut, context, xml)
    }

    // Apply postFilter
    if (postFilter) {
      temp = condense(matcherOut, postMap)
      postFilter(temp, [], context, xml)

      // Un-match failing elements by moving them back to matcherIn
      i = temp.length
      while (i--) {
        if ((elem = temp[i])) {
          matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem)
        }
      }
    }

    if (seed) {
      if (postFinder || preFilter) {
        if (postFinder) {
          // Get the final matcherOut by condensing this intermediate into postFinder contexts
          temp = []
          i = matcherOut.length
          while (i--) {
            if ((elem = matcherOut[i])) {
              // Restore matcherIn since elem is not yet a final match
              temp.push((matcherIn[i] = elem))
            }
          }
          postFinder(null, (matcherOut = []), temp, xml)
        }

        // Move matched elements from seed to results to keep them synchronized
        i = matcherOut.length
        while (i--) {
          if ((elem = matcherOut[i]) &&
              (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
            seed[temp] = !(results[temp] = elem)
          }
        }
      }

      // Add elements to results, through postFinder if defined
    } else {
      matcherOut = condense(
        matcherOut === results
          ? matcherOut.splice(preexisting, matcherOut.length)
          : matcherOut
      )
      if (postFinder) {
        postFinder(null, results, matcherOut, xml)
      } else {
        push.apply(results, matcherOut)
      }
    }
  })
}

function matcherFromTokens (tokens) {
  let checkContext; let matcher; let j
  const len = tokens.length
  const leadingRelative = Expr.relative[tokens[0].type]
  const implicitRelative = leadingRelative || Expr.relative[' ']
  let i = leadingRelative ? 1 : 0

  // The foundational matcher ensures that elements are reachable from top-level context(s)
  const matchContext = addCombinator(function (elem) {
    return elem === checkContext
  }, implicitRelative, true)
  const matchAnyContext = addCombinator(function (elem) {
    return indexOf(checkContext, elem) > -1
  }, implicitRelative, true)
  let matchers = [function (elem, context, xml) {
    const ret = (!leadingRelative && (xml || context !== outermostContext)) || (
      (checkContext = context).nodeType
        ? matchContext(elem, context, xml)
        : matchAnyContext(elem, context, xml))

    // Avoid hanging onto element (issue #299)
    checkContext = null
    return ret
  }]

  for (; i < len; i++) {
    if ((matcher = Expr.relative[tokens[i].type])) {
      matchers = [addCombinator(elementMatcher(matchers), matcher)]
    } else {
      matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches)

      // Return special upon seeing a positional matcher
      if (matcher[expando]) {
        // Find the next relative operator (if any) for proper handling
        j = ++i
        for (; j < len; j++) {
          if (Expr.relative[tokens[j].type]) {
            break
          }
        }
        return setMatcher(
          i > 1 && elementMatcher(matchers),
          i > 1 && toSelector(

            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
            tokens
              .slice(0, i - 1)
              .concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })
          ).replace(rtrim, '$1'),
          matcher,
          i < j && matcherFromTokens(tokens.slice(i, j)),
          j < len && matcherFromTokens((tokens = tokens.slice(j))),
          j < len && toSelector(tokens)
        )
      }
      matchers.push(matcher)
    }
  }

  return elementMatcher(matchers)
}

function matcherFromGroupMatchers (elementMatchers, setMatchers) {
  const bySet = setMatchers.length > 0
  const byElement = elementMatchers.length > 0
  const superMatcher = function (seed, context, xml, results, outermost) {
    let elem; let j; let matcher
    let matchedCount = 0
    let i = '0'
    const unmatched = seed && []
    let setMatched = []
    const contextBackup = outermostContext

    // We must always have either seed elements or outermost context
    const elems = seed || byElement && Expr.find.TAG('*', outermost)

    // Use integer dirruns iff this is the outermost matcher
    const dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1)
    const len = elems.length

    if (outermost) {
      // Support: IE 11+, Edge 17 - 18+
      // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
      // two documents; shallow comparisons work.
      // eslint-disable-next-line eqeqeq
      outermostContext = context == _document || context || outermost
    }

    // Add elements passing elementMatchers directly to results
    // Support: IE<9, Safari
    // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    for (; i !== len && (elem = elems[i]) != null; i++) {
      if (byElement && elem) {
        j = 0

        // Support: IE 11+, Edge 17 - 18+
        // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        if (!context && elem.ownerDocument != _document) {
          setDocument(elem)
          xml = !documentIsHTML
        }
        while ((matcher = elementMatchers[j++])) {
          if (matcher(elem, context || _document, xml)) {
            results.push(elem)
            break
          }
        }
        if (outermost) {
          dirruns = dirrunsUnique
        }
      }

      // Track unmatched elements for set filters
      if (bySet) {
        // They will have gone through all possible matchers
        if ((elem = !matcher && elem)) {
          matchedCount--
        }

        // Lengthen the array for every element, matched or not
        if (seed) {
          unmatched.push(elem)
        }
      }
    }

    // `i` is now the count of elements visited above, and adding it to `matchedCount`
    // makes the latter nonnegative.
    matchedCount += i

    // Apply set filters to unmatched elements
    // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    // no element matchers and no seed.
    // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    // case, which will result in a "00" `matchedCount` that differs from `i` but is also
    // numerically zero.
    if (bySet && i !== matchedCount) {
      j = 0
      while ((matcher = setMatchers[j++])) {
        matcher(unmatched, setMatched, context, xml)
      }

      if (seed) {
        // Reintegrate element matches to eliminate the need for sorting
        if (matchedCount > 0) {
          while (i--) {
            if (!(unmatched[i] || setMatched[i])) {
              setMatched[i] = pop.call(results)
            }
          }
        }

        // Discard index placeholder values to get only actual matches
        setMatched = condense(setMatched)
      }

      // Add matches to results
      push.apply(results, setMatched)

      // Seedless set matches succeeding multiple successful matchers stipulate sorting
      if (outermost && !seed && setMatched.length > 0 &&
            (matchedCount + setMatchers.length) > 1) {
        Sizzle.uniqueSort(results)
      }
    }

    // Override manipulation of globals by nested matchers
    if (outermost) {
      dirruns = dirrunsUnique
      outermostContext = contextBackup
    }

    return unmatched
  }

  return bySet
    ? markFunction(superMatcher)
    : superMatcher
}

compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
  let i
  const setMatchers = []
  const elementMatchers = []
  let cached = compilerCache[selector + ' ']

  if (!cached) {
    // Generate a function of recursive functions that can be used to check each element
    if (!match) {
      match = tokenize(selector)
    }
    i = match.length
    while (i--) {
      cached = matcherFromTokens(match[i])
      if (cached[expando]) {
        setMatchers.push(cached)
      } else {
        elementMatchers.push(cached)
      }
    }

    // Cache the compiled function
    cached = compilerCache(
      selector,
      matcherFromGroupMatchers(elementMatchers, setMatchers)
    )

    // Save selector and tokenization
    cached.selector = selector
  }
  return cached
}

/**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
select = Sizzle.select = function (selector, context, results, seed) {
  let i; let tokens; let token; let type; let find
  const compiled = typeof selector === 'function' && selector
  const match = !seed && tokenize((selector = compiled.selector || selector))

  results = results || []

  // Try to minimize operations if there is only one selector in the list and no seed
  // (the latter of which guarantees us context)
  if (match.length === 1) {
    // Reduce context if the leading compound selector is an ID
    tokens = match[0] = match[0].slice(0)
    if (tokens.length > 2 && (token = tokens[0]).type === 'ID' &&
        context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
      context = (Expr.find.ID(token.matches[0]
        .replace(runescape, funescape), context) || [])[0]
      if (!context) {
        return results

        // Precompiled matchers will still verify ancestry, so step up a level
      } else if (compiled) {
        context = context.parentNode
      }

      selector = selector.slice(tokens.shift().value.length)
    }

    // Fetch a seed set for right-to-left matching
    i = matchExpr.needsContext.test(selector) ? 0 : tokens.length
    while (i--) {
      token = tokens[i]

      // Abort if we hit a combinator
      if (Expr.relative[(type = token.type)]) {
        break
      }
      if ((find = Expr.find[type])) {
        // Search, expanding context for leading sibling combinators
        if ((seed = find(
          token.matches[0].replace(runescape, funescape),
          rsibling.test(tokens[0].type) && testContext(context.parentNode) ||
              context
        ))) {
          // If seed is empty or no tokens remain, we can return early
          tokens.splice(i, 1)
          selector = seed.length && toSelector(tokens)
          if (!selector) {
            push.apply(results, seed)
            return results
          }

          break
        }
      }
    }
  }

  // Compile and execute a filtering function if one is not provided
  // Provide `match` to avoid retokenization if we modified the selector above
  (compiled || compile(selector, match))(
    seed,
    context,
    !documentIsHTML,
    results,
    !context || rsibling.test(selector) && testContext(context.parentNode) || context
  )
  return results
}

// One-time assignments

// Sort stability
support.sortStable = expando.split('').sort(sortOrder).join('') === expando

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate

// Initialize against the default document
setDocument()

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function (el) {
  // Should return 1, but returns 4 (following)
  return el.compareDocumentPosition(_document.createElement('fieldset')) & 1
})

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if (!assert(function (el) {
  el.innerHTML = "<a href='#'></a>"
  return el.firstChild.getAttribute('href') === '#'
})) {
  addHandle('type|href|height|width', function (elem, name, isXML) {
    if (!isXML) {
      return elem.getAttribute(name, name.toLowerCase() === 'type' ? 1 : 2)
    }
  })
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if (!support.attributes || !assert(function (el) {
  el.innerHTML = '<input/>'
  el.firstChild.setAttribute('value', '')
  return el.firstChild.getAttribute('value') === ''
})) {
  addHandle('value', function (elem, _name, isXML) {
    if (!isXML && elem.nodeName.toLowerCase() === 'input') {
      return elem.defaultValue
    }
  })
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if (!assert(function (el) {
  return el.getAttribute('disabled') == null
})) {
  addHandle(booleans, function (elem, name, isXML) {
    let val
    if (!isXML) {
      return elem[name] === true ? name.toLowerCase()
        : (val = elem.getAttributeNode(name)) && val.specified
          ? val.value
          : null
    }
  })
}

// EXPOSE
const _sizzle = window.Sizzle

Sizzle.noConflict = function () {
  if (window.Sizzle === Sizzle) {
    window.Sizzle = _sizzle
  }

  return Sizzle
}
