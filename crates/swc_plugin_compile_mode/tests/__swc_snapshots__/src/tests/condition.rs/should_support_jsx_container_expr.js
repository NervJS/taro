const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}"></view></view></template>';
function Index() {
    return <View compileMode="f0t0">

          {<View hoverClass={myClass}></View>}

        </View>;
}
