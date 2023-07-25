import { LabelProps } from '@tarojs/components/dist/types/Label'
import React, { useRef } from 'react'

export const Label: React.FC<LabelProps> = (props: LabelProps) => {

  const labelRef = useRef<HTMLDivElement>(null)
  const clickHandler = () => {

    let forElement: Element | null | undefined
    if (props.for) {
      forElement = document.getElementById(`${props.for}`)
    } else {
      forElement = labelRef.current?.firstElementChild
    }

    if (forElement) {
      try {
        // @ts-ignore
        forElement.checked = !forElement.checked
      } catch (e) {
        // @ts-ignore
        forElement?.click()
      }
    }
  }

  return (<div ref={labelRef} onClick={clickHandler}>{props.children}</div>)

}
