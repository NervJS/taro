export default function Index() {
    function renderB() {
        return <View> 

        <View>ComponentB </View>

        {renderA()}

        </View>;
    }
    function renderC() {
        return <View>

          <View>ComponentC</View>

          {renderA()}

        </View>;
    }
    function renderD() {
        return <View>

          <View>ComponentD</View>

          {renderC()}

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

            {renderA()}

            {renderB()}

            {<View>

          <View>ComponentC</View>

          {renderA()}

        </View>}

            {<View>

          <View>ComponentD</View>

          {<View>

          <View>ComponentC</View>

          {renderA()}

        </View>}

        </View>}

          </View>

        </View>;
}
