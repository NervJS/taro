const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><text>Hello World!</text><text>Hello{{i.cn[0].cn[0].v}}World{{i.cn[0].cn[1].v}}!</text><view><text></text></view><view hover-stop-propagation="true" style="color: red"><text>Hello World!</text></view><view style="{{i.cn[1].st}}"><text>Hello World!</text></view></view></template>';
function Index() {
    return <View compileMode="f0t0">

            

            <Text>{T1}{T2}</Text>

            

            

            <View style={myStyle}>

                

            </View>

          </View>;
}
