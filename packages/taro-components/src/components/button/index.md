button

## API

|     | 属性                   | 类型    | 默认值       | 说明                                                                                        |
| --- | ---------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------- |
| √   | type                   | String  | default      | 按钮的样式类型                                                                              |
| √   | size                   | String  | default      | 按钮的大小 px                                                                               |
| √   | plain                  | Boolean | false        | 按钮是否镂空，背景色透明                                                                    |
| √   | disabled               | Boolean | false        | 是否禁用                                                                                    |
| √   | loading                | Boolean | false        | 名称前是否带 loading 图标                                                                   |
|     | form-type              | String  |              | 用于 form 组件，点击分别会触发 form 组件的 submit/reset 事件                                |
|     | open-type              | String  |              | 微信开放能力                                                                                |
|     | app-parameter          | String  |              | 打开 APP 时，向 APP 传递的参数                                                              |
| √   | hover-class            | String  | button-hover | 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果                            |
|     | hover-stop-propagation | Boolean | false        | 指定是否阻止本节点的祖先节点出现点击态                                                      |
| √   | hover-start-time       | Number  | 20           | 按住后多久出现点击态，单位毫秒                                                              |
| √   | hover-stay-time        | Number  | 70           | 手指松开后点击态保留时间，单位毫秒                                                          |
|     | bindgetuserinfo        | Handler |              | 用户点击该按钮时，会返回获取到的用户信息，从返回参数的 detail 中获取到的值同 wx.getUserInfo |
|     | lang                   | String  | en           | 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。                           |
