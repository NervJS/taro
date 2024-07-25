const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><wxs module="logic" src="./logic.wxs"></wxs><view>AA{{logic.msg}}BB</view><view>{{i.c[0].c[0].v}}AA{{logic.getMsg()}}BB</view><view>Name: {{i.c[1].c[0].v}}, Msg: {{logic.getMsg(null,i.c[1].c[1].v,1,i.c[1].c[2].v,"sss",i.c[1].c[3].v,true)}}</view></view></template>';
const TARO_XML_SOURCES = [
    "./logic.wxs"
];
function Index() {
    return <View compileMode="f0t0">

            

            

            <View>{value}</View>

            <View>{name}{value1}{value2}{value3}</View>

          </View>;
}
