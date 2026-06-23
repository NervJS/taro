import { createComponent as _$createComponent } from 'r-custom'
import { Button, Icon, Text, View } from '@tarojs/components'
export default function Index() {
  return _$createComponent(View, {
    class: 'index',
    get children() {
      return [
        _$createComponent(View, {
          get children() {
            return _$createComponent(Text, {
              children: 'Hello world! ',
            })
          },
        }),
        _$createComponent(View, {
          get children() {
            return _$createComponent(Text, {
              children: 'Hello world2! ',
            })
          },
        }),
        _$createComponent(Button, {
          children: 'set class',
        }),
        _$createComponent(View, {
          get children() {
            return Math.random()
          },
        }),
        _$createComponent(Icon, {
          type: 'success',
        }),
      ]
    },
  })
}