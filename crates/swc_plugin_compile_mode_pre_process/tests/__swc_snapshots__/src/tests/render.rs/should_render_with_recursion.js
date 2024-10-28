export default function Index() {
    function renderB() {
        return <View> ComponentB </View>;
    }
    function renderC() {
        return <View>

          <View>ComponentC</View>

          {renderB()}

          {renderA()}

        </View>;
    }
    function renderD() {
        return <View>

          <View>ComponentD</View>

          {renderB()}

        </View>;
    }
    function renderA() {
        return <View>

        <View>ComponentA</View>

        {renderB()}

       </View>;
    }
    return <View>

          <View compileMode>

            {<View>

        <View>ComponentA</View>

        {<View> ComponentB </View>}

       </View>}

            {<View> ComponentB </View>}

            {<View>

          <View>ComponentC</View>

          {<View> ComponentB </View>}

          {<View>

        <View>ComponentA</View>

        {<View> ComponentB </View>}

       </View>}

        </View>}

            {<View>

          <View>ComponentD</View>

          {<View> ComponentB </View>}

        </View>}

          </View>

        </View>;
}
