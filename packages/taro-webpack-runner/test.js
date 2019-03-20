const { partial, partialRight, toPairs, fromPairs, map, pipe, transform, merge } = require('lodash/fp')
const _ =  require('lodash/fp')

const a = {
  test: 'aa',
  test1: 'bb'
}

const ccc = pipe(
  toPairs,
  map(([k, v]) => {
    return [k + 1, v + 2]
  }),
  fromPairs,
  merge(a)
)(a)

console.log(ccc);
