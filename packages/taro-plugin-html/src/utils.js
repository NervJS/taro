import { isHasExtractProp } from '@tarojs/runtime';
import { isFunction, isString, toCamelCase } from '@tarojs/shared';
import { blockElements, inlineElements, specialElements } from './constant';
export function isHtmlTags(nodeName) {
    if (inlineElements.has(nodeName) || blockElements.has(nodeName) || specialElements.has(nodeName)) {
        return true;
    }
    return false;
}
export function getMappedType(nodeName, rawProps, node) {
    if (inlineElements.has(nodeName)) {
        return 'text';
    }
    else if (specialElements.has(nodeName)) {
        const mapping = specialElements.get(nodeName);
        if (isString(mapping)) {
            return mapping;
        }
        const { mapName } = mapping;
        return isFunction(mapName) ? mapName(rawProps) : mapName;
    }
    else {
        // fix #15326
        if (process.env.TARO_ENV === 'swan')
            return 'view';
        if (node) {
            const { props } = node;
            for (const prop in props) {
                const propInCamelCase = toCamelCase(prop);
                if (propInCamelCase === 'catchMove' && props[prop] !== false) {
                    return 'catch-view';
                }
            }
        }
        if (!node) {
            return 'view';
        }
        if (node.isOnlyClickBinded() && !isHasExtractProp(node)) {
            return 'click-view';
        }
        else if (node.isAnyEventBinded()) {
            return 'view';
        }
        else if (isHasExtractProp(node)) {
            return 'static-view';
        }
        else {
            return 'pure-view';
        }
    }
}
export function getAttrMapFn(nodeName) {
    const mapping = specialElements.get(nodeName);
    if (!isString(mapping)) {
        return mapping === null || mapping === void 0 ? void 0 : mapping.mapAttr;
    }
}
function getMapNameByCondition(nodeName, attr, props) {
    const mapping = specialElements.get(nodeName);
    if (!mapping || isString(mapping))
        return;
    const { mapName, mapNameCondition } = mapping;
    if (!mapNameCondition)
        return;
    if (mapNameCondition.indexOf(attr) > -1 && !isString(mapName)) {
        return mapName(props);
    }
}
export function mapNameByContion(nodeName, key, element, componentsAlias) {
    const mapName = getMapNameByCondition(nodeName, key, element.props);
    if (mapName) {
        const mapNameAlias = componentsAlias[mapName]._num;
        element.enqueueUpdate({
            path: `${element._path}.${"nn" /* Shortcuts.NodeName */}`,
            value: mapNameAlias
        });
    }
}
export function ensureHtmlClass(tagName, className = '') {
    const classList = className.split(' ');
    const htmlClass = `h5-${tagName}`;
    if (classList.indexOf(htmlClass) === -1) {
        classList.unshift(htmlClass);
    }
    return classList.join(' ');
}
export function ensureRect(props, style = '') {
    let cssText = style;
    const { width, height } = props;
    if (width) {
        cssText = `width: ${width};${cssText}`;
    }
    if (height) {
        cssText = `height: ${height};${cssText}`;
    }
    return cssText;
}
export function defineMappedProp(obj, propName, mapName) {
    Object.defineProperty(obj, propName, {
        enumerable: true,
        configurable: true,
        get() {
            return obj[mapName];
        },
        set(val) {
            obj[mapName] = val;
        }
    });
}
//# sourceMappingURL=utils.js.map