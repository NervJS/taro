import { Button, Icon, Text, View as MyView } from '@tarojs/components'
import { Input, RenderWithChildren, RenderWithSlot } from 'somewhere'

export default function Index() {
  return (
    <MyView class="index">
      <MyView>
        <Text>Hello world! </Text>
      </MyView>
      <MyView >
        <Text>Hello world2! </Text>
      </MyView>
      <Button>set class</Button>
      <Input></Input>
      <MyView>{Math.random()}</MyView>
      <Icon type="success"></Icon>
      <RenderWithSlot header={<MyView></MyView>}></RenderWithSlot>
      <RenderWithSlot header={<Button>button</Button>}></RenderWithSlot>
      <RenderWithSlot header={<Input></Input>}></RenderWithSlot>
      <RenderWithChildren>
        <Button>RenderWithChildren1</Button>
      </RenderWithChildren>
      <RenderWithChildren>
        <MyView>RenderWithChildren2</MyView>
      </RenderWithChildren>
      <RenderWithChildren>
        <Button>
          <MyView>variant1</MyView>
        </Button>
      </RenderWithChildren>
      <RenderWithChildren>
        <MyView>
          <Button>variant2</Button>
        </MyView>
      </RenderWithChildren>
      <RenderWithChildren>
        <MyView>
          <Input></Input>
        </MyView>
      </RenderWithChildren>
    </MyView>
  )
}
