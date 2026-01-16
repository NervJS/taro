const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><wxs module="penny" src="./penny.wxs"></wxs><view hover-class="{{penny.hoverClass}}">A1</view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}">A2</view></view></template>';
const TARO_TEMPLATES_f0t1 = '<template name="tmpl_0_f0t1"><view><wxs module="magic" src="../xmls/magic.wxs"></wxs><view hover-class="{{magic.hoverClass}}">B1</view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}">B2</view></view></template>';
const TARO_XML_SOURCES = [
    "./penny.wxs",
    "../xmls/magic.wxs"
];
function Index() {
    return <View>

            <View compileMode="f0t0">

                

                

                <View hoverClass={magic.hoverClass}></View>

            </View>

            <View compileMode="f0t1">

                

                

                <View hoverClass={penny.hoverClass}></View>

            </View>

          </View>;
}
