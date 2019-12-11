import {
  QUICKAPP_Native_Support_Components_SET,
  QUICKAPP_Taro_Simulate_Components_SET,
  QUICKAPP_Un_Support_Component_SET,
  UI_Native_Support_Components_SET,
  UI_Un_Support_Component_SET
} from '../src/constant'

export interface ValidatorResult {
  name: string,
  isRuntimeNameUpdated?: boolean,
  isTemplateNameUpdated?: boolean,
}

//抽象策略类
interface Validator {
  validatorCheck (name: string): ValidatorResult
}

//判断策略类
class ValidatorJudge {
  private validator: Validator
  private componentName: string

  public setComponentName (name: string) {
    this.componentName = name
}
  public setValidator (validator: Validator): void {
    this.validator = validator
  }

  public getValidator (): ValidatorResult {
    return this.validator.validatorCheck(this.componentName)
  }
}

//快应用原生组件类：名称不变
class QucikappNativeValidator implements Validator {
  public validatorCheck (name: string): ValidatorResult {
    return {
      name: name
    }
  }
}

//快应用模拟组件类：组件名称匹配时，添加Taro前缀
class QucikappTaroSimulateValidator implements Validator {
  public validatorCheck (name: string): ValidatorResult {
    return {
      name: `Taro${name}`,
      isRuntimeNameUpdated: true
    }
  }
}

//快应用原生不支持组件类：通过div模拟，待运行时补齐
class QucikappUnSupportValidator implements Validator {
  public validatorCheck (name: string): ValidatorResult {
    let componentName = 'div'
    if (name === 'Block') {
      componentName = 'block'
    }
    return {
      name: componentName,
      isTemplateNameUpdated: true
    }
  }
}

//UI原生支持组件类：组件名称匹配时，At前缀截断，如果为模拟组件替换为Taro前缀
class UiNativeValidator implements Validator {
  public validatorCheck (name: string): ValidatorResult {
    let componentName = name.slice(2, name.length)
    if (QUICKAPP_Taro_Simulate_Components_SET.has(componentName)) {
      componentName = `Taro${componentName}`
    }
    return {
      name: componentName,
      isTemplateNameUpdated: true
    }
  }
}

//UI不支持组件类：通过div模拟，待运行时实现相应效果进行补齐
class UiUnSupportValidator implements Validator {
  public validatorCheck (): ValidatorResult {
    let componentName = 'div'
    return {
      name: componentName,
      isTemplateNameUpdated: true
    }
  }
}

//自定义组件类：名称不变
class UiCustomStyleValidator implements Validator {
  public validatorCheck (name: string): ValidatorResult {
    return {
      name: name
    }
  }
}

//策略中心类
export default class ValidatorStrategy {
  public static validator (name: string): ValidatorResult {
    let valiJudge: ValidatorJudge = new ValidatorJudge()
    valiJudge.setComponentName(name)
    if (QUICKAPP_Native_Support_Components_SET.has(name)) {
      valiJudge.setValidator(new QucikappNativeValidator())
    } else if (QUICKAPP_Taro_Simulate_Components_SET.has(name)) {
      valiJudge.setValidator(new QucikappTaroSimulateValidator())
    } else if (QUICKAPP_Un_Support_Component_SET.has(name)) {
      valiJudge.setValidator(new QucikappUnSupportValidator())
    } else if (UI_Native_Support_Components_SET.has(name)) {
      valiJudge.setValidator(new UiNativeValidator())
    } else if (UI_Un_Support_Component_SET.has(name)) {
      valiJudge.setValidator(new UiUnSupportValidator())
    } else {
      valiJudge.setValidator(new UiCustomStyleValidator())
    }
    return valiJudge.getValidator()
  }
}
