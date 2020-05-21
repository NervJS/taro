import * as React from 'react'
import { ViewProps } from '../View/PropsType'

// _Block.displayName = '_Block'

const _Block: React.SFC<ViewProps> = (props) => {
  return (
    <>
      {props.children}
    </>
  )
}

export { _Block }
export default _Block
