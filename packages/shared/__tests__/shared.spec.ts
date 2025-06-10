import { indent } from '../src/utils'

describe('shared utils', () => {
  it('#indent', async () => {
    const inner =
`<text>
  hello, world
</text>`

    const outer =
`<view>
  ${indent(inner, 2)}
</view>`

    const result =
`<view>
  <text>
    hello, world
  </text>
</view>`

    expect(outer).toBe(result)
  })
})
