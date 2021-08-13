import * as React from 'react'
import { _ViewProps } from '../View/PropsType'

// _Block.displayName = '_Block'

const _Block: React.FC<_ViewProps> = (props: _ViewProps) => {
  return (
    <>
      {props.children}
    </>
  )
}

export { _Block }
export default _Block
