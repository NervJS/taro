const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view class="{{i.cn[0].cl}}"><view custom-prop="{{i.cn[0].cn[0].customProp}}" style="{{i.cn[0].cn[0].st}}"></view><view hover-stay-time="{{xs.b(i.cn[0].cn[1].p3,400)}}"><view hover-class="{{xs.b(i.cn[0].cn[1].cn[0].p1,\'none\')}}" id="{{i.cn[0].cn[1].cn[0].uid}}"></view></view></view></view></template>';
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
