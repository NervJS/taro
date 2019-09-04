import { quickappComponentName } from './constant'
const noTaroPrefixComponents = new Set([
    'Icon',
    'RichText',
    'Checkbox',
    'Radio',
    'SwiperItem',
    'Navigator',
    'ScrollView',
    'WebView'
])

const unsupportQuickappComponent = new Set([
    'Ad',
    'Block',
    'View',
    'CoverView',
    'Form',
    'RadioGroup',
    'CheckboxGroup',
    'PickerView',
    'PickerViewColumn',
    'RadioGroup',
    'CheckboxGroup',
    'LivePlayer',
    'LivePusher',
    'OpenData',
    'SwiperItem',
    'MovableArea',
    'MovableView',
    'FunctionalPageNavigator'
])
interface SimuResult {
    name: string,
    isTaroComponent?: boolean,
    isQuickappComponent?: boolean
}

interface Component {
    simulate(name: string): SimuResult
}
//环境类
class SimulateEnv {
    private component: Component
    private componentName: string

    public setComponentName(name: string) {
        this.componentName = name
    }

    public setComponent(component: Component): void {
        this.component = component
    }

    public getSimulateComponent(): SimuResult {
        return this.component.simulate(this.componentName)
    }
}
//使用Taro兼容库组件(component-qa)模拟
class TaroSimulateComponent implements Component {
    public simulate(name: string): SimuResult {
        let simulateName = ''
        if(noTaroPrefixComponents.has(name)) {
            simulateName = name
        } else if (name === 'CoverImage') {
            simulateName = 'TaroImage'
        } else {
            simulateName = `Taro${name}`
        }
        return {
            name: simulateName,
            isTaroComponent: true
        }
    }
}
//使用快应用原生组件模拟
class QuickappSimulateComponent implements Component {
    public simulate(name: string): SimuResult {
        let simulateName = 'div'
        if (name === 'Block') {
            simulateName = 'block'
        }
        return {
            name: simulateName,
            isQuickappComponent: true
        }
    }
}
//快应用原生组件或用户自定义组件，无需模拟
class QuickappComponent implements Component {
    public simulate(name: string): SimuResult {
        return {
            name: name
        }
    }
}

//策略中心类
export default class simulateComponent {
    public static simu(name: string): SimuResult {
        let simuEnv: SimulateEnv = new SimulateEnv()
        simuEnv.setComponentName(name)
        if (quickappComponentName.has(name) || noTaroPrefixComponents.has(name)) {
            simuEnv.setComponent(new TaroSimulateComponent())
        } else if(unsupportQuickappComponent.has(name)) {
            simuEnv.setComponent(new QuickappSimulateComponent())
        } else {
            simuEnv.setComponent(new QuickappComponent())
        }
        return simuEnv.getSimulateComponent()
    }
}