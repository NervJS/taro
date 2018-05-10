##### view
##### 视图容器


|     | 属性                   | 类型    | 默认值 | 说明                                                         |
| --- | ---------------------- | ------- | ------ | ------------------------------------------------------------ |
| √   | hover-class            | String  | none   | 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果 |
| √   | hover-start-time       | Number  | 50     | 按住后多久出现点击态，单位毫秒                               |
| √   | hover-stay-time        | Number  | 400    | 手指松开后点击态保留时间，单位毫秒                           |
|     | hover-stop-propagation | Boolean | false  | 指定是否阻止本节点的祖先节点出现点击态                       |


###### 示例：
```
<Text>flex-direction: row\n横向布局</Text>
<View className="flex-wrp" style="flex-direction:row;">
  <View className="flex-item demo-text-1"/>
  <View className="flex-item demo-text-2"/>
  <View className="flex-item demo-text-3"/>
</View>
<Text>flex-direction: column\n纵向布局</Text>

<View className="flex-wrp" style="flex-direction:column;">
  <View className="flex-item flex-item-V demo-text-1"/>
  <View className="flex-item flex-item-V demo-text-2"/>
  <View className="flex-item flex-item-V demo-text-3"/>
</View>
```

