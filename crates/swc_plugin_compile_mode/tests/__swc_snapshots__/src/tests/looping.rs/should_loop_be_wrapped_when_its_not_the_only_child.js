const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view><view><view>{{i.c[0].c[0].c[0].c[0].v}}</view></view><block><view wx:for="{{i.c[0].c[1].c}}" wx:key="s">{{item.c[0].v}}</view></block></view><view><view>1</view><view hover-class="myClass" wx:for="{{i.c[1].c}}" wx:key="s">{{item.c[0].v}}</view><view>2<view hover-class="myClass"></view></view></view><view><view>1</view><block><view wx:for="{{i.c[2].c[0].c}}" wx:key="s">{{item.c[0].v}}</view></block><view>2<view hover-class="myClass"></view></view><block><view wx:for="{{i.c[2].c[1].c}}" wx:key="s">{{item.c[0].v}}</view></block></view></view></template>';
function Index() {
    return <View compileMode="f0t0">

            <View>

              <View><View>{content}</View></View>

              <block>{list.map((item)=><View>{item}</View>)}</block>

            </View>

            <View>

              

              {list.map((item)=><View>{item}</View>)}

              

            </View>

            <View>

              

              <block>{list.map((item)=><View>{item}</View>)}</block>

              

              <block>{list.map((item)=><View>{item}</View>)}</block>

            </View>

          </View>;
}
