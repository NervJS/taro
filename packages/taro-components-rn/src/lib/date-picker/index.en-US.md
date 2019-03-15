---
category: Components
type: Data Entry
title: DatePicker
---

Used to select a date or time.

### Rules
- A maximum of five independent rollers are shown, each of which represents a different value.


## API

Properties | Descrition | Type | Default
-----------|------------|------|--------
| mode  | mode value, can be a `date` or `time` or `datetime` or `year` or `month` | String | `date` |
| value | the currently selected value | Date | - |
| minDate   | minimum date | Date  |  2000-1-1  |
| maxDate   | maximum date | Date  |  2030-1-1  |
| minuteStep |   The amount of time, in minutes, between each minute item.    | Number | 1 |
| locale   | international, can override the configuration of the global `[LocaleProvider](https://mobile.ant.design/components/locale-provider)` | Object: {DatePickerLocale: {year, month, day, hour, minute, am?, pm?}, okText, dismissText} |  -  |
| disabled   | set disabled  | Boolean |    false  |
| onChange  | change handler | (date: Object): void |  -  |
| onValueChange | fire when picker col change | (vals: any, index: number) => void | - |
| format  | format the selected value | `(value: Date) => date string` / `format string`(corresponding mode under the format are: `YYYY-MM-DD` or `HH:mm` or `YYYY-MM-DD HH:mm`) | - |
| title  | title | string/React.ReactElement |  -  |
| itemStyle  | itemStyle |   StyleProp<ViewStyle>;
 |  -  |
| extra   | the display text | String  |  `请选择`  |
| onOk  | handler called when click ok | (val): void  |  - |
| onDismiss  | handler called when click cancel | (): void  |  -  |

Note: The date strings have different implementations in different browsers. For example, `new Date ('2017-1-1')` is an Invalid Date on Safari but is parsed properly on Chrome.

Note: We suggest DatePicker's children to be `List.Item`, if not, you need to be a custom component which accept and handle `onClick` / `extra` / `chidlren` props, see [demo](https://mobile.ant.design/components/date-picker)
