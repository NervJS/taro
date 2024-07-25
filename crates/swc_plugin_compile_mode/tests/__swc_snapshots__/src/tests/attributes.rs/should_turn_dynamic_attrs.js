const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view class="{{i.c[0].l}}"><view custom-prop="{{i.c[0].c[0].customProp}}" style="{{i.c[0].c[0].st}}"></view><view hover-stay-time="{{xs.b(i.c[0].c[1].p3,400)}}"><view hover-class="{{xs.b(i.c[0].c[1].c[0].p1,\'none\')}}" id="{{i.c[0].c[1].c[0].uid}}"></view></view></view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            <View class={myClass}>
              <View style={myStyle} customProp={myCustomProp}></View>
              <View hoverStayTime={myTime}>
                <View hoverClass={myHoverClass} id={myId}></View>
              </View>
            </View>
          </View>;
}
