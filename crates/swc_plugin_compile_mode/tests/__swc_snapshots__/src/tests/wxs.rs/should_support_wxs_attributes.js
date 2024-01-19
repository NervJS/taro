const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><wxs module="logic" src="./logic.wxs"></wxs><view hover-class="{{logic.hoverClass}}">A</view><view hover-class="{{logic.getHoverClass()}}">B</view><view class="{{i.cn[0].cl}}" hover-class="{{logic.getHoverClass(null,i.cn[0].xs0,1,i.cn[0].xs1,\'sss\',i.cn[0].xs2,true)}}">C</view></view></template>';
const TARO_XML_SOURCES = [
    "./logic.wxs"
];
function Index() {
    return <View compileMode="f0t0">

            

            

            

            <View className={myClass} xs0={value1} xs1={value2} xs2={value3}></View>

          </View>;
}
