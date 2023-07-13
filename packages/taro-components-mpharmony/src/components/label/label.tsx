import { LabelProps } from '@tarojs/components/dist/types/Label'
import React, { Component, useCallback,useState } from 'react'

export class Label extends Component<LabelProps> {

  override render () {
    const [checked, setChecked] = useState(false)
    const clickHandler = useCallback(() => {
      setChecked(!checked)

      let forElement
      if (this.props.for) {
        forElement = document.getElementById(`${this.props.for}`)
      } else {
        const childrenArray = React.Children.toArray(this.props.children)
        forElement = childrenArray && childrenArray.length > 0 && childrenArray[0]
      }
      forElement?.click()
    }, [checked])

    return (<div onClick={clickHandler}>{this.props.children}</div>)
  }

}
