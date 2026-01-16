const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><wxs module="john" src="./john.wxs"></wxs><view bindtouchend="{{john.touchend}}" bindtouchmove="{{john.touchmove}}" bindtouchstart="{{john.touchstart}}"></view><view bindtouchmove="{{john.touchmove}}" hover-class="{{xs.b(i.cn[0].p1,\'none\')}}"></view></view></template>';
const TARO_XML_SOURCES = [
    "./john.wxs"
];
function Index() {
    return <View compileMode="f0t0">

                

                

                <View hoverClass={cls}/>

            </View>;
}
