import { Button, Icon, Text, View } from '@tarojs/components'

export default function Index() {
  return (
    <View class="index">
      <View>
        <Text>Hello world! </Text>
      </View>
      <View >
        <Text>Hello world2! </Text>
      </View>
      <Button>set class</Button>

      <View>{Math.random()}</View>
      <Icon type="success"></Icon>
    </View>
  )
}
