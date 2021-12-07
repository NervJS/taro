/*eslint-disable*/

// excluding regex trick: http://www.rexegg.com/regex-best-trick.html

// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by PX
// !singlequotes|!doublequotes|!url()|pixelunit

module.exports = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)(PX)/g
