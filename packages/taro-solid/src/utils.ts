import { Style, TaroElement } from "@tarojs/runtime";
import {
  capitalize,
  internalComponents,
  isFunction,
  isNumber,
  isObject,
  isString,
  toCamelCase,
} from "@tarojs/shared";

const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
type StyleValue = Record<string, string | number>;
interface DangerouslySetInnerHTML {
  __html?: string;
}
type ClassList = { [key: string]: boolean };

function isEventName(s: string) {
  return s.startsWith("on");
}

export function setProperty(
  dom: TaroElement,
  name: string,
  value: unknown,
  oldValue?: unknown
) {
  name = name === "className" ? "class" : name;

  if (name === "key" || name === "children" || name === "ref") {
    // skip
  } else if (name === "style") {
    const style = dom.style;
    if (isString(value)) {
      style.cssText = value;
    } else {
      if (isString(oldValue)) {
        style.cssText = "";
        oldValue = null;
      }

      if (isObject<StyleValue>(oldValue)) {
        for (const i in oldValue) {
          if (!(value && i in (value as StyleValue))) {
            setStyle(style, i, "");
          }
        }
      }

      if (isObject<StyleValue>(value)) {
        for (const i in value) {
          if (!oldValue || value[i] !== (oldValue as StyleValue)[i]) {
            setStyle(style, i, value[i]);
          }
        }
      }
    }
  } else if (name === "classList") {
    const map = diffClassList(value as ClassList, oldValue as ClassList);
    for (const key in map) {
      if (key === "") {
        continue;
      }
      if (map[key]) {
        dom.classList.add(key);
      } else {
        dom.classList.remove(key);
      }
    }
  } else if (isEventName(name)) {
    setEvent(dom, name, value, oldValue);
  } else if (name === "dangerouslySetInnerHTML") {
    const newHtml = (value as DangerouslySetInnerHTML)?.__html ?? "";
    const oldHtml = (oldValue as DangerouslySetInnerHTML)?.__html ?? "";
    if (newHtml || oldHtml) {
      if (oldHtml !== newHtml) {
        dom.innerHTML = newHtml;
      }
    }
  } else if (!isFunction(value)) {
    if (value == null) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value as string);
    }
  }
}

function diffClassList(newVal: ClassList, oldVal: ClassList) {
  const result: ClassList = {};
  for (const key in oldVal) {
    if (newVal[key] !== oldVal[key]) {
      result[key] = newVal[key];
    }
  }
  for (const key in newVal) {
    if (result.hasOwnProperty(key)) {
      continue;
    }
    result[key] = newVal[key];
  }
  return result;
}

function setStyle(style: Style, key: string, value: string | number) {
  if (key[0] === "-") {
    style.setProperty(key, value.toString());
  }

  style[key] =
    isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
      ? value + "px"
      : value == null
      ? ""
      : value;
}

function setEvent(
  dom: TaroElement,
  name: string,
  value: unknown,
  oldValue?: unknown
) {
  const isCapture = name.endsWith("Capture");
  let eventName = name.toLowerCase().slice(2);
  if (isCapture) {
    eventName = eventName.slice(0, -7);
  }

  const compName = capitalize(toCamelCase(dom.tagName.toLowerCase()));

  if (eventName === "click" && compName in internalComponents) {
    eventName = "tap";
  }

  if (isFunction(value)) {
    if (oldValue) {
      dom.removeEventListener(eventName, oldValue as any, false);
      dom.addEventListener(eventName, value, { isCapture, sideEffect: false });
    } else {
      dom.addEventListener(eventName, value, isCapture);
    }
  } else {
    dom.removeEventListener(eventName, oldValue as any);
  }
}
