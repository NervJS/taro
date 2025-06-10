const rule = require('../rules/jsx-handler-names')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = 'JSX 事件名需以 `on` 命名'

ruleTester.run('jsx-handler-names', rule, {
  valid: [
    {
      code: testComponent(`<View onClick={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchStart={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchMove={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchCancel={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchEnd={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onLongPress={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onLongClick={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTransitionEnd={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onAnimationStart={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onAnimationIteration={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onAnimationEnd={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchForceChange={this.handleClick} />`)
    },
    {
      code: testComponent(`<View onTouchForceChange={this.test} />`)
    },
    {
      code: testComponent(`<View onTouchForceChange={this.props.on} />`)
    },
    {
      code: testComponent(`<View onTouchForceChange={this.props.dsfsdf} />`)
    },
    {
      code: testComponent(`array.map(item => <View key={'1'} />)`)
    },
    {
      code: testComponent(`array.map(item => <View key={item} />)`)
    },
    {
      code: testComponent(`<View key={this.handleClick} />`)
    },
    {
      code: testComponent(`<View className={this.state.handleClick} />`)
    },
    {
      code: testComponent(`<View key={handleClick} />`)
    },
    {
      code: testComponent(`<View src={a.b} />`)
    },
    {
      code: testComponent(`<View src={this.state.img} />`)
    },
    {
      code: testComponent(`<Image src={this.props.img} />`)
    },
    {
      code: testComponent(`<Image src={this.$router.img} />`)
    },
    {
      code: testComponent(`<Image src={this.$router.params.title} />`)
    },
    {
      code: testComponent(`<Text src={this.config.navbarTitle}></Text>`)
    },
    {
      code: testComponent(`<Text src={this.config.navbarTitle}></Text>`)
    },
    {
      code: testComponent(`<AtNavBar src={this.config.navbarTitle} />`)
    }
  ],
  invalid: [{
    code: testComponent(`<View onclick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View handleClick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View on-click={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent onclick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent handleClick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent oNClick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent ONClick={this.handleClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View oTest={this.dsfsdf} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View oTest={this.props.onClick} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View handleClick={this.stateChange} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<View handleClick={this.propsChange} />`),
    errors: [{ message: ERROR_MESSAGE }]
  }]
})
