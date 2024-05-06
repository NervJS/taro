const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><wxs module="logic" src="./logic.wxs"></wxs><view>AA{{logic.msg}}BB</view><view>{{i.cn[0].cn[0].v}}AA{{logic.getMsg()}}BB</view><view>Name: {{i.cn[1].cn[0].v}}, Msg: {{logic.getMsg(null,i.cn[1].cn[1].v,1,i.cn[1].cn[2].v,"sss",i.cn[1].cn[3].v,true)}}</view></view></template>';
const TARO_XML_SOURCES = [
    "./logic.wxs"
];
function Index() {
    return <View compileMode="f0t0">

            

            

            <View>{value}</View>

            <View>{name}{value1}{value2}{value3}</View>

          </View>;
}
